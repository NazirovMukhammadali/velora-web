import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import type { ParsedUrlQuery } from 'querystring';
import { mapHeroQueryToFilters } from '../utils/heroSearch';

export type UseCatalogQueryOptions<T extends Record<string, string>> = {
	/** Keys that debounce URL updates (e.g. text search). */
	debounceKeys?: (keyof T)[];
	debounceMs?: number;
	/** Map legacy or hero query params into catalog filter shape. */
	mapQuery?: (query: ParsedUrlQuery) => Partial<T>;
	/** Query keys to remove when syncing filters (e.g. hero ?location= on flights). */
	stripQueryKeys?: string[];
	/** Apply shared hero param normalization (dates/party/from-to aliases). Default true. */
	applyHeroMapping?: boolean;
};

const queryValue = (query: ParsedUrlQuery, key: string): string => {
	const value = query[key];
	if (typeof value === 'string') return value;
	if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
	return '';
};

const buildUrlQuery = <T extends Record<string, string>>(
	currentQuery: ParsedUrlQuery,
	next: T,
	defaults: T,
	stripQueryKeys: string[] = [],
): ParsedUrlQuery => {
	const query: ParsedUrlQuery = { ...currentQuery };

	for (const key of Object.keys(defaults)) {
		delete query[key];
	}

	for (const key of stripQueryKeys) {
		delete query[key];
	}

	for (const [key, value] of Object.entries(next)) {
		if (value && value !== defaults[key as keyof T]) {
			query[key] = value;
		}
	}

	return query;
};

const trackedKeys = <T extends Record<string, string>>(defaults: T, stripQueryKeys: string[]): string[] =>
	Array.from(new Set([...Object.keys(defaults), ...stripQueryKeys])).sort();

const serializeTrackedQuery = (query: ParsedUrlQuery, keys: string[]): string =>
	keys.map((key) => `${key}=${queryValue(query, key)}`).join('&');

/**
 * Sync catalog filter state with URL query params (?location=...&sort=...).
 * Omits default values from the URL so share links stay clean.
 * Skips router.replace when the tracked query is unchanged (avoids loops).
 */
export const useCatalogQuery = <T extends Record<string, string>>(
	defaultFilters: T,
	options: UseCatalogQueryOptions<T> = {},
) => {
	const router = useRouter();
	const defaultsRef = useRef(defaultFilters);
	defaultsRef.current = defaultFilters;
	const mapQueryRef = useRef(options.mapQuery);
	mapQueryRef.current = options.mapQuery;
	const stripQueryKeysRef = useRef(options.stripQueryKeys ?? []);
	stripQueryKeysRef.current = options.stripQueryKeys ?? [];
	const applyHeroMappingRef = useRef(options.applyHeroMapping !== false);
	applyHeroMappingRef.current = options.applyHeroMapping !== false;
	const debounceKeysRef = useRef(options.debounceKeys);
	debounceKeysRef.current = options.debounceKeys;
	const debounceMsRef = useRef(options.debounceMs ?? 400);
	debounceMsRef.current = options.debounceMs ?? 400;
	const [filters, setFilters] = useState<T>(defaultFilters);
	const filtersRef = useRef<T>(defaultFilters);
	const [ready, setReady] = useState(false);
	const debounceRef = useRef<ReturnType<typeof setTimeout>>();
	const hydratingRef = useRef(false);

	const commitFilters = useCallback((next: T) => {
		filtersRef.current = next;
		setFilters(next);
	}, []);

	const filtersFromQuery = useCallback((query: ParsedUrlQuery): T => {
		const defaults = defaultsRef.current;
		const next = { ...defaults };

		for (const key of Object.keys(defaults) as (keyof T)[]) {
			const value = queryValue(query, key as string);
			if (value) {
				next[key] = value as T[keyof T];
			}
		}

		if (applyHeroMappingRef.current) {
			Object.assign(next, mapHeroQueryToFilters(query, defaults));
		}
		if (mapQueryRef.current) {
			Object.assign(next, mapQueryRef.current(query));
		}
		return next;
	}, []);

	const syncUrl = useCallback(
		(next: T) => {
			if (!router.isReady || hydratingRef.current) return;

			const defaults = defaultsRef.current;
			const stripKeys = stripQueryKeysRef.current;
			const query = buildUrlQuery(router.query, next, defaults, stripKeys);
			const keys = trackedKeys(defaults, stripKeys);
			const nextSerialized = serializeTrackedQuery(query, keys);
			const currentSerialized = serializeTrackedQuery(router.query, keys);

			if (nextSerialized === currentSerialized) return;

			void router.replace({ pathname: router.pathname, query }, undefined, { shallow: true });
		},
		[router],
	);

	useEffect(() => {
		if (!router.isReady || ready) return;

		hydratingRef.current = true;
		const next = filtersFromQuery(router.query);
		commitFilters(next);
		setReady(true);

		// Clean invalid/stripped params from the address bar once after hydrate.
		queueMicrotask(() => {
			hydratingRef.current = false;
			syncUrl(next);
		});
	}, [router.isReady, router.query, ready, syncUrl, filtersFromQuery, commitFilters]);

	// Re-sync when the URL changes from outside (navbar link, Back/Forward, shared link).
	useEffect(() => {
		if (!ready || !router.isReady || hydratingRef.current || debounceRef.current) return;

		const defaults = defaultsRef.current;
		const keys = trackedKeys(defaults, stripQueryKeysRef.current);
		const fromState = serializeTrackedQuery(
			buildUrlQuery(router.query, filtersRef.current, defaults, stripQueryKeysRef.current),
			keys,
		);
		if (fromState === serializeTrackedQuery(router.query, keys)) return;

		commitFilters(filtersFromQuery(router.query));
	}, [ready, router.isReady, router.query, filtersFromQuery, commitFilters]);

	useEffect(
		() => () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		},
		[],
	);

	const setFilter = useCallback(
		<K extends keyof T>(key: K, value: T[K]) => {
			const next = { ...filtersRef.current, [key]: value };
			commitFilters(next);

			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
				debounceRef.current = undefined;
			}

			if ((debounceKeysRef.current ?? []).includes(key)) {
				// Sync whatever the filters are when the timer fires, not a stale snapshot.
				debounceRef.current = setTimeout(() => {
					debounceRef.current = undefined;
					syncUrl(filtersRef.current);
				}, debounceMsRef.current);
			} else {
				syncUrl(next);
			}
		},
		[syncUrl, commitFilters],
	);

	const setFiltersPatch = useCallback(
		(patch: Partial<T>) => {
			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
				debounceRef.current = undefined;
			}
			const next = { ...filtersRef.current, ...patch };
			commitFilters(next);
			syncUrl(next);
		},
		[syncUrl, commitFilters],
	);

	return { filters, setFilter, setFilters: setFiltersPatch, ready };
};

export default useCatalogQuery;
