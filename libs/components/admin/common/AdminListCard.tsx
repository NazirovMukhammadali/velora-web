import React from 'react';
import { CircularProgress, IconButton, InputAdornment, OutlinedInput, TablePagination } from '@mui/material';
import { MagnifyingGlass, X } from 'phosphor-react';
import type { AdminInquiryState } from './useAdminInquiry';

export type AdminTab = { value: string; label: string };

type AdminListCardProps = {
	inquiry: Pick<
		AdminInquiryState,
		| 'tab'
		| 'setTab'
		| 'searchInput'
		| 'setSearchInput'
		| 'applySearch'
		| 'clearSearch'
		| 'page'
		| 'limit'
		| 'setPage'
		| 'setLimit'
	>;
	tabs?: AdminTab[];
	total: number;
	loading?: boolean;
	searchPlaceholder?: string;
	/** Extra filter controls rendered next to the search box. */
	filters?: React.ReactNode;
	/** Buttons rendered at the right of the toolbar (e.g. "Add hotel"). */
	actions?: React.ReactNode;
	children: React.ReactNode;
};

/** White card with status tabs, search, optional filters, the table and pagination. */
const AdminListCard = ({
	inquiry,
	tabs,
	total,
	loading,
	searchPlaceholder = 'Search…',
	filters,
	actions,
	children,
}: AdminListCardProps) => (
	<section className="va-card">
		{tabs && tabs.length > 0 && (
			<div className="va-tabs" role="tablist">
				{tabs.map((tab) => (
					<button
						key={tab.value}
						type="button"
						role="tab"
						aria-selected={inquiry.tab === tab.value}
						className={`va-tabs__item ${inquiry.tab === tab.value ? 'is-active' : ''}`}
						onClick={() => inquiry.setTab(tab.value)}
					>
						{tab.label}
						{inquiry.tab === tab.value && <span className="va-tabs__count">{total}</span>}
					</button>
				))}
			</div>
		)}

		<div className="va-toolbar">
			<OutlinedInput
				className="va-toolbar__search"
				size="small"
				value={inquiry.searchInput}
				placeholder={searchPlaceholder}
				onChange={(e) => inquiry.setSearchInput(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') inquiry.applySearch();
				}}
				startAdornment={
					<InputAdornment position="start">
						<MagnifyingGlass size={18} />
					</InputAdornment>
				}
				endAdornment={
					inquiry.searchInput ? (
						<InputAdornment position="end">
							<IconButton size="small" aria-label="Clear search" onClick={inquiry.clearSearch}>
								<X size={16} />
							</IconButton>
						</InputAdornment>
					) : null
				}
			/>
			{filters}
			<div className="va-toolbar__spacer" />
			{loading && <CircularProgress size={20} />}
			{actions}
		</div>

		<div className="va-table-scroll">{children}</div>

		<TablePagination
			component="div"
			count={total}
			page={Math.max(0, inquiry.page - 1)}
			rowsPerPage={inquiry.limit}
			rowsPerPageOptions={[10, 20, 50]}
			onPageChange={(_, next) => inquiry.setPage(next + 1)}
			onRowsPerPageChange={(e) => inquiry.setLimit(parseInt(e.target.value, 10))}
		/>
	</section>
);

export default AdminListCard;
