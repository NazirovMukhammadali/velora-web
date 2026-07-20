import {
	buildHeroSearchQuery,
	isValidIsoDate,
	mapHeroQueryToFilters,
	parsePartyCount,
	stripKeysForCatalog,
	validateHeroSearch,
} from '../libs/utils/heroSearch';

describe('heroSearch', () => {
	it('validates ISO dates without UTC shift', () => {
		expect(isValidIsoDate('2026-08-01')).toBe(true);
		expect(isValidIsoDate('2026-02-30')).toBe(false);
		expect(isValidIsoDate('08-01-2026')).toBe(false);
	});

	it('parses party counts within bounds', () => {
		expect(parsePartyCount('2')).toBe(2);
		expect(parsePartyCount('2 guests')).toBe(2);
		expect(parsePartyCount('0')).toBeNull();
		expect(parsePartyCount('99')).toBeNull();
	});

	it('requires distinct from/to for flights', () => {
		const result = validateHeroSearch(
			{
				location: '',
				from: 'Tashkent',
				to: 'tashkent',
				startDate: '2026-08-01',
				endDate: '',
				party: '1',
			},
			'flights',
		);
		expect(result.ok).toBe(false);
	});

	it('builds hotel query with guests alias', () => {
		const query = buildHeroSearchQuery(
			{
				location: 'Paris',
				from: '',
				to: '',
				startDate: '2026-08-01',
				endDate: '2026-08-05',
				party: '2',
			},
			'/hotels',
			'2',
		);
		expect(query).toEqual({
			location: 'Paris',
			startDate: '2026-08-01',
			endDate: '2026-08-05',
			party: '2',
			guests: '2',
		});
	});

	it('maps guests → party and location → to for flights', () => {
		const patch = mapHeroQueryToFilters(
			{ guests: '3', location: 'Seoul', startDate: '2026-09-01' },
			{ to: '', party: '', startDate: '', endDate: '' },
		);
		expect(patch).toMatchObject({ to: 'Seoul', party: '3', startDate: '2026-09-01' });
	});

	it('strips foreign keys per catalog', () => {
		expect(stripKeysForCatalog('/flights')).toContain('location');
		expect(stripKeysForCatalog('/hotels')).toContain('from');
	});
});
