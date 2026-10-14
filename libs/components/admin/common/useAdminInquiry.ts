import { useMemo, useState } from 'react';

export const ALL_TAB = 'ALL';

type Options = {
	limit?: number;
	sort?: string;
	direction?: 'ASC' | 'DESC';
};

/**
 * Paging + tab + text-search state shared by admin list pages.
 * `buildSearch` turns the current tab / text / filters into the backend `search` object.
 */
export const useAdminInquiry = <F extends Record<string, string>>(
	buildSearch: (state: { tab: string; text: string; filters: F }) => Record<string, unknown>,
	initialFilters: F,
	options: Options = {},
) => {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(options.limit ?? 10);
	const [tab, setTabState] = useState(ALL_TAB);
	const [searchInput, setSearchInput] = useState('');
	const [text, setText] = useState('');
	const [filters, setFilters] = useState<F>(initialFilters);

	const input = useMemo(
		() => ({
			page,
			limit,
			sort: options.sort ?? 'createdAt',
			direction: options.direction ?? 'DESC',
			search: buildSearch({ tab, text, filters }),
		}),
		// buildSearch is a pure mapping supplied by the page; re-run only on state changes.
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[page, limit, tab, text, filters, options.sort, options.direction],
	);

	return {
		input,
		page,
		limit,
		tab,
		searchInput,
		filters,
		setTab: (next: string) => {
			setTabState(next);
			setPage(1);
		},
		setSearchInput,
		applySearch: () => {
			setText(searchInput.trim());
			setPage(1);
		},
		clearSearch: () => {
			setSearchInput('');
			setText('');
			setPage(1);
		},
		setFilter: (key: keyof F, value: string) => {
			setFilters((prev) => ({ ...prev, [key]: value }));
			setPage(1);
		},
		setPage,
		setLimit: (next: number) => {
			setLimit(next);
			setPage(1);
		},
	};
};

export type AdminInquiryState = ReturnType<typeof useAdminInquiry>;
