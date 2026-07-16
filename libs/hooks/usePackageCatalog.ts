import { useMemo } from 'react';
import { useQuery, type DocumentNode, type OperationVariables } from '@apollo/client';
import useCatalogQuery, { type UseCatalogQueryOptions } from './useCatalogQuery';

/** Default list query variables shared by every catalog (page 1, newest first). */
export const DEFAULT_CATALOG_VARIABLES: OperationVariables = {
	input: { page: 1, limit: 24, sort: 'createdAt', direction: 'DESC' },
};

type CatalogFilters = Record<string, string>;

/**
 * @template TItem  View model rendered by the page (e.g. VeloraPackage, Flight).
 * @template TFilters  Filter/URL state shape.
 * @template TData  Raw GraphQL query result.
 * @template TRaw  Raw backend node type before mapping.
 */
export type UsePackageCatalogConfig<
	TItem,
	TFilters extends CatalogFilters,
	TData = Record<string, any>,
	TRaw = any,
> = {
	/** GraphQL list query (e.g. GET_TOURS). */
	query: DocumentNode;
	/** Pick the raw list off the query result. */
	selectList: (data: TData | undefined) => TRaw[] | null | undefined;
	/** Map the backend list into the view model. */
	mapApi: (list: TRaw[] | null | undefined) => TItem[];
	/** Static catalog used when the API returns nothing (demo / offline fallback). */
	fallback: () => TItem[];
	/** Initial filter shape; also drives URL query-param sync. */
	filterDefaults: TFilters;
	/** URL-sync options (debounceKeys, mapQuery, stripQueryKeys). */
	catalogOptions?: UseCatalogQueryOptions<TFilters>;
	/** Predicate applied per item against the active filters. */
	filterItem: (item: TItem, filters: TFilters) => boolean;
	/** Sort the filtered list using `filters.sort`. */
	sortItems: (list: TItem[], sort: string) => TItem[];
	/** Override the default query variables if a page needs different paging. */
	variables?: OperationVariables;
};

/**
 * Unifies the catalog data pipeline shared by /tours, /hotels, /rentcar, /flights:
 * Apollo query → API-first mapping with static fallback → URL-synced filters →
 * filter → sort → loading/empty flags. Pages stay thin and only own their toolbar JSX.
 */
export function usePackageCatalog<
	TItem,
	TFilters extends CatalogFilters,
	TData = Record<string, any>,
	TRaw = any,
>(config: UsePackageCatalogConfig<TItem, TFilters, TData, TRaw>) {
	const { data, loading } = useQuery<TData>(config.query, {
		fetchPolicy: 'cache-and-network',
		errorPolicy: 'all',
		variables: config.variables ?? DEFAULT_CATALOG_VARIABLES,
	});

	const { filters, setFilter, setFilters, ready } = useCatalogQuery(config.filterDefaults, config.catalogOptions);

	// API-first: prefer backend results, otherwise fall back to the curated static catalog.
	const allItems = useMemo(() => {
		const apiItems = config.mapApi(config.selectList(data));
		return apiItems.length > 0 ? apiItems : config.fallback();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	const items = useMemo(() => {
		if (!ready) return allItems;
		const filtered = allItems.filter((item) => config.filterItem(item, filters));
		return config.sortItems(filtered, filters.sort);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [allItems, filters, ready]);

	return {
		filters,
		setFilter,
		setFilters,
		ready,
		/** Filtered + sorted view list. */
		items,
		/** Unfiltered list (e.g. to derive category facets). */
		allItems,
		total: items.length,
		isInitialLoading: loading && !data,
	};
}

export default usePackageCatalog;
