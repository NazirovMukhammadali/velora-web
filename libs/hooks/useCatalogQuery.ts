import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import type { ParsedUrlQuery } from 'querystring';

export type UseCatalogQueryOptions<T extends Record<string, string>> = {
	/** Keys that debounce URL updates (e.g. text search). */
	debounceKeys?: (keyof T)[];
	debounceMs?: number;
	/** Map legacy or hero query params into catalog filter shape. */
	mapQuery?: (query: ParsedUrlQuery) => Partial<T>;
	/** Query keys to remove when syncing filters (e.g. hero ?location= on flights). */
	stripQueryKeys?: string[];
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

/**
 * Sync catalog filter state with URL query params (?location=...&sort=...).
 * Omits default values from the URL so share links stay clean.
 */
export const useCatalogQuery = <T extends Record<string, string>>(
	defaultFilters: T,
	options: UseCatalogQueryOptions<T> = {},
) => {
	const router = useRouter();
	const defaultsRef = useRef(defaultFilters);
	const mapQueryRef = useRef(options.mapQuery);
	mapQueryRef.current = options.mapQuery;
	const stripQueryKeysRef = useRef(options.stripQueryKeys ?? []);
	stripQueryKeysRef.current = options.stripQueryKeys ?? [];
	const debounceKeysRef = useRef(options.debounceKeys);
	debounceKeysRef.current = options.debounceKeys;
	const debounceMsRef = useRef(options.debounceMs ?? 400);
	debounceMsRef.current = options.debounceMs ?? 400;
	const [filters, setFilters] = useState<T>(defaultFilters);
	const [ready, setReady] = useState(false);
	const debounceRef = useRef<ReturnType<typeof setTimeout>>();

	const syncUrl = useCallback(
		(next: T) => {
			if (!router.isReady) return;
			const query = buildUrlQuery(router.query, next, defaultsRef.current, stripQueryKeysRef.current);
			void router.replace({ pathname: router.pathname, query }, undefined, { shallow: true });
		},
		[router],
	);

	useEffect(() => {
		if (!router.isReady || ready) return;

		const next = { ...defaultFilters };
		for (const key of Object.keys(defaultFilters) as (keyof T)[]) {
			const value = router.query[key as string];
			if (typeof value === 'string' && value !== '') {
				next[key] = value as T[keyof T];
			}
		}
		if (mapQueryRef.current) {
			Object.assign(next, mapQueryRef.current(router.query));
		}
		setFilters(next);
		setReady(true);
	}, [router.isReady, router.query, defaultFilters, ready]);

	useEffect(
		() => () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		},
		[],
	);

	const setFilter = useCallback(
		<K extends keyof T>(key: K, value: T[K]) => {
			setFilters((prev) => {
				const next = { ...prev, [key]: value };
				const debounceKeys = debounceKeysRef.current ?? [];

				if (debounceKeys.includes(key)) {
					if (debounceRef.current) clearTimeout(debounceRef.current);
					debounceRef.current = setTimeout(() => syncUrl(next), debounceMsRef.current);
				} else {
					syncUrl(next);
				}

				return next;
			});
		},
		[syncUrl],
	);

	const setFiltersPatch = useCallback(
		(patch: Partial<T>) => {
			setFilters((prev) => {
				const next = { ...prev, ...patch };
				syncUrl(next);
				return next;
			});
		},
		[syncUrl],
	);

	return { filters, setFilter, setFilters: setFiltersPatch, ready };
};

export default useCatalogQuery;
