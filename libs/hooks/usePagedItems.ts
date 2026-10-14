import { useEffect, useMemo, useState } from 'react';

/** Client-side paging over an already filtered list; any change to `items` (filters, sort) resets to page 1. */
export const usePagedItems = <T>(items: T[], pageSize: number) => {
	const [page, setPage] = useState(1);

	useEffect(() => {
		setPage(1);
	}, [items]);

	const pageItems = useMemo(() => items.slice((page - 1) * pageSize, page * pageSize), [items, page, pageSize]);

	return { page, setPage, pageItems };
};

export default usePagedItems;
