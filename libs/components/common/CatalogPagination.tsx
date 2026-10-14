import React, { useLayoutEffect, useRef } from 'react';
import { Pagination } from '@mui/material';

type CatalogPaginationProps = {
	page: number;
	pageSize: number;
	total: number;
	/** Plural noun for the summary line ("tours", "experts"). */
	label: string;
	onChange: (page: number) => void;
};

/**
 * Numbered pager + "Showing 1–8 of 43 tours" line; renders nothing when everything fits on one page.
 * Changing page keeps the pager at the same spot on screen (a shorter last page would otherwise pull it up).
 */
const CatalogPagination = ({ page, pageSize, total, label, onChange }: CatalogPaginationProps) => {
	const navRef = useRef<HTMLElement>(null);
	// Viewport position to hold the pager at, kept briefly so async (server-paged) lists are covered too.
	const anchor = useRef<{ top: number; until: number } | null>(null);

	useLayoutEffect(() => {
		const held = anchor.current;
		if (!held || !navRef.current) return;
		if (Date.now() > held.until) {
			anchor.current = null;
			return;
		}
		const drift = navRef.current.getBoundingClientRect().top - held.top;
		if (drift !== 0) window.scrollBy({ top: drift, behavior: 'instant' as ScrollBehavior });
	});

	const pageCount = Math.ceil(total / pageSize);
	if (pageCount <= 1) return null;

	const from = (page - 1) * pageSize + 1;
	const to = Math.min(page * pageSize, total);

	return (
		<nav ref={navRef} className="catalog-pagination" aria-label="Pagination">
			<Pagination
				page={page}
				count={pageCount}
				shape="circular"
				onChange={(_, next) => {
					const top = navRef.current?.getBoundingClientRect().top;
					anchor.current = top === undefined ? null : { top, until: Date.now() + 2000 };
					onChange(next);
				}}
			/>
			<span>
				Showing {from}–{to} of {total} {label}
			</span>
		</nav>
	);
};

export default CatalogPagination;
