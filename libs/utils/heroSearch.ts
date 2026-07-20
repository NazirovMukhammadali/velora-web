import type { ParsedUrlQuery } from 'querystring';
import type { SearchTabKey } from '../types/hero';

export const HERO_PARTY_MIN = 1;
export const HERO_PARTY_MAX = 20;

export type HeroCatalogRoute = '/hotels' | '/flights' | '/rentcar' | '/tours';

export type HeroSearchForm = {
	location: string;
	from: string;
	to: string;
	startDate: string;
	endDate: string;
	party: string;
};

export type HeroSearchQuery = Partial<{
	location: string;
	from: string;
	to: string;
	startDate: string;
	endDate: string;
	party: string;
	guests: string;
}>;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const isValidIsoDate = (value: string): boolean => {
	if (!DATE_RE.test(value)) return false;
	const [year, month, day] = value.split('-').map(Number);
	const date = new Date(year, month - 1, day);
	return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

export const parsePartyCount = (value: string): number | null => {
	const trimmed = value.trim();
	if (!trimmed) return null;
	const match = trimmed.match(/\d+/);
	if (!match) return null;
	const count = Number(match[0]);
	if (!Number.isInteger(count) || count < HERO_PARTY_MIN || count > HERO_PARTY_MAX) return null;
	return count;
};

export const normalizePartyParam = (value: string): string => {
	const count = parsePartyCount(value);
	return count == null ? '' : String(count);
};

export type HeroSearchValidation = {
	ok: boolean;
	message?: string;
	party?: string;
};

export const validateHeroSearch = (form: HeroSearchForm, tab: SearchTabKey): HeroSearchValidation => {
	const start = form.startDate.trim();
	const end = form.endDate.trim();

	if (start && !isValidIsoDate(start)) {
		return { ok: false, message: 'Please enter a valid start date.' };
	}
	if (end && !isValidIsoDate(end)) {
		return { ok: false, message: 'Please enter a valid end date.' };
	}
	if (start && end && end < start) {
		return { ok: false, message: 'End date must be on or after the start date.' };
	}

	if (tab === 'flights') {
		const from = form.from.trim();
		const to = form.to.trim();
		if (!from || !to) {
			return { ok: false, message: 'Enter both departure and destination.' };
		}
		if (from.toLowerCase() === to.toLowerCase()) {
			return { ok: false, message: 'Departure and destination must be different.' };
		}
	}

	const partyRaw = form.party.trim();
	if (partyRaw) {
		const party = parsePartyCount(partyRaw);
		if (party == null) {
			return {
				ok: false,
				message: `Enter between ${HERO_PARTY_MIN} and ${HERO_PARTY_MAX} passengers/guests.`,
			};
		}
		return { ok: true, party: String(party) };
	}

	return { ok: true, party: '' };
};

const setIfPresent = (query: Record<string, string>, key: string, value: string) => {
	const trimmed = value.trim();
	if (trimmed) query[key] = trimmed;
};

/**
 * Build catalog-specific URL query from the hero form.
 * Only includes params that apply to the target route.
 */
export const buildHeroSearchQuery = (
	form: HeroSearchForm,
	route: HeroCatalogRoute,
	validatedParty = '',
): Record<string, string> => {
	const query: Record<string, string> = {};
	const party = validatedParty || normalizePartyParam(form.party);

	if (route === '/flights') {
		setIfPresent(query, 'from', form.from);
		setIfPresent(query, 'to', form.to || form.location);
	} else {
		setIfPresent(query, 'location', form.location);
	}

	setIfPresent(query, 'startDate', form.startDate);
	setIfPresent(query, 'endDate', form.endDate);
	if (party) {
		query.party = party;
		if (route === '/hotels') query.guests = party;
	}

	return query;
};

export const routeForSearchTab = (tab: SearchTabKey): HeroCatalogRoute => {
	switch (tab) {
		case 'flights':
			return '/flights';
		case 'rentcar':
			return '/rentcar';
		default:
			return '/hotels';
	}
};

/** Shared hero keys every catalog may inherit from shared/bookmarked URLs. */
export const HERO_SHARED_FILTER_KEYS = ['location', 'from', 'to', 'startDate', 'endDate', 'party', 'guests'] as const;

export const readQueryString = (query: ParsedUrlQuery, key: string): string => {
	const value = query[key];
	if (typeof value === 'string') return value;
	if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
	return '';
};

/**
 * Normalize hero-related query values when hydrating catalog filters.
 * - guests → party (hotels)
 * - location → to (flights) when to is empty
 * - invalid dates / party counts are dropped
 */
export const mapHeroQueryToFilters = <T extends Record<string, string>>(
	query: ParsedUrlQuery,
	defaults: T,
): Partial<T> => {
	const patch: Partial<T> = {};
	const keys = Object.keys(defaults);

	for (const key of keys) {
		const raw = readQueryString(query, key);
		if (!raw) continue;

		if (key === 'startDate' || key === 'endDate') {
			if (isValidIsoDate(raw)) {
				(patch as Record<string, string>)[key] = raw;
			}
			continue;
		}

		if (key === 'party' || key === 'guests') {
			const party = normalizePartyParam(raw);
			if (party) (patch as Record<string, string>)[key] = party;
			continue;
		}

		(patch as Record<string, string>)[key] = raw;
	}

	if ('party' in defaults && !patch.party) {
		const guests = normalizePartyParam(readQueryString(query, 'guests'));
		if (guests) (patch as Record<string, string>).party = guests;
	}

	if ('guests' in defaults && !patch.guests && patch.party) {
		(patch as Record<string, string>).guests = String(patch.party);
	}

	if ('to' in defaults && !patch.to) {
		const location = readQueryString(query, 'location');
		if (location) (patch as Record<string, string>).to = location;
	}

	const start = (patch as Record<string, string>).startDate ?? '';
	const end = (patch as Record<string, string>).endDate ?? '';
	if (start && end && end < start) {
		delete (patch as Record<string, string>).endDate;
	}

	return patch;
};

/** Keys that must never linger on a catalog URL after sync. */
export const stripKeysForCatalog = (route: HeroCatalogRoute): string[] => {
	switch (route) {
		case '/flights':
			return ['location', 'guests', 'price', 'category'];
		case '/hotels':
			return ['from', 'to', 'category'];
		case '/rentcar':
			return ['from', 'to', 'guests'];
		case '/tours':
			return ['from', 'to', 'guests', 'price'];
		default:
			return [];
	}
};
