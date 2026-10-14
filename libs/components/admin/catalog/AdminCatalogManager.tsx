import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { type DocumentNode, useMutation, useQuery } from '@apollo/client';
import {
	Button,
	IconButton,
	MenuItem,
	Select,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Tooltip,
} from '@mui/material';
import { ArrowSquareOut, PencilSimple, Plus, Trash } from 'phosphor-react';
import AdminListCard from '../common/AdminListCard';
import AdminFormDialog, { type AdminField, type AdminFormValues } from '../common/AdminFormDialog';
import StatusChip, { humanize } from '../common/StatusChip';
import { ALL_TAB, useAdminInquiry } from '../common/useAdminInquiry';
import type { ListResult } from '../../../types/admin/catalog';
import { sweetConfirmAlert, sweetErrorHandlingForAdmin, sweetTopSmallSuccessAlert } from '../../../sweetAlert';

export type CatalogColumn<T> = {
	label: string;
	align?: 'left' | 'center' | 'right';
	render: (row: T) => React.ReactNode;
};

export type CatalogFilter = { key: string; label: string; searchKey: string; options: string[] };

export type CatalogConfig<T extends { _id: string }> = {
	/** Singular, human readable ("Hotel"). */
	entity: string;
	listQuery: DocumentNode;
	listField: string;
	statusField: keyof T & string;
	statuses: string[];
	deleteStatus: string;
	searchPlaceholder: string;
	filters?: CatalogFilter[];
	columns: CatalogColumn<T>[];
	publicHref?: (row: T) => string;
	createMutation?: DocumentNode;
	/** Shown instead of the Add button when the catalog is created elsewhere (e.g. agents create tours). */
	createNote?: string;
	updateMutation: DocumentNode;
	removeMutation: DocumentNode;
	removeVariable: string;
	fields: AdminField[];
	toForm: (row?: T) => AdminFormValues;
	toInput: (values: AdminFormValues) => Record<string, unknown>;
	validate?: (values: AdminFormValues) => Record<string, string>;
};

type DraftState<T> = { mode: 'create' } | { mode: 'edit'; row: T } | null;

function AdminCatalogManager<T extends { _id: string }>({ config }: { config: CatalogConfig<T> }) {
	const filterDefaults = useMemo(
		() => Object.fromEntries((config.filters ?? []).map((filter) => [filter.key, ALL_TAB])),
		[config.filters],
	);
	const inquiry = useAdminInquiry(({ tab, text, filters }) => {
		const search: Record<string, unknown> = {};
		if (tab !== ALL_TAB) search[config.statusField] = tab;
		if (text) search.text = text;
		for (const filter of config.filters ?? []) {
			if (filters[filter.key] && filters[filter.key] !== ALL_TAB) search[filter.searchKey] = filters[filter.key];
		}
		return search;
	}, filterDefaults);

	const { data, loading, refetch } = useQuery(config.listQuery, {
		fetchPolicy: 'network-only',
		notifyOnNetworkStatusChange: true,
		variables: { input: inquiry.input },
	});
	const [createItem] = useMutation(config.createMutation ?? config.updateMutation);
	const [updateItem] = useMutation(config.updateMutation);
	const [removeItem] = useMutation(config.removeMutation);

	const [draft, setDraft] = useState<DraftState<T>>(null);
	const [saving, setSaving] = useState(false);

	const result: ListResult<T> | undefined = data?.[config.listField];
	const rows = result?.list ?? [];
	const total = result?.metaCounter?.[0]?.total ?? 0;
	const editableStatuses = config.statuses.filter((status) => status !== config.deleteStatus);

	const draftValues = useMemo(
		() => (draft?.mode === 'edit' ? config.toForm(draft.row) : config.toForm()),
		[draft, config],
	);

	/** HANDLERS **/
	const changeStatus = async (row: T, status: string) => {
		try {
			await updateItem({ variables: { input: { _id: row._id, [config.statusField]: status } } });
			await refetch();
			sweetTopSmallSuccessAlert(`${config.entity} marked ${humanize(status).toLowerCase()}`, 900).then();
		} catch (err) {
			sweetErrorHandlingForAdmin(err).then();
		}
	};

	const remove = async (row: T) => {
		try {
			if (!(await sweetConfirmAlert(`Delete this ${config.entity.toLowerCase()}? It will disappear from the website.`)))
				return;
			await removeItem({ variables: { [config.removeVariable]: row._id } });
			await refetch();
			sweetTopSmallSuccessAlert('Deleted', 800).then();
		} catch (err) {
			sweetErrorHandlingForAdmin(err).then();
		}
	};

	const save = async (values: AdminFormValues) => {
		if (!draft) return;
		setSaving(true);
		try {
			const input = config.toInput(values);
			if (draft.mode === 'edit') {
				await updateItem({ variables: { input: { _id: draft.row._id, ...input } } });
			} else {
				await createItem({ variables: { input } });
			}
			setDraft(null);
			await refetch();
			sweetTopSmallSuccessAlert('Saved', 800).then();
		} catch (err) {
			sweetErrorHandlingForAdmin(err).then();
		} finally {
			setSaving(false);
		}
	};

	const tabs = [
		{ value: ALL_TAB, label: 'All' },
		...config.statuses.map((status) => ({
			value: status,
			label: status === config.deleteStatus ? 'Deleted' : humanize(status),
		})),
	];

	return (
		<>
			<AdminListCard
				inquiry={inquiry}
				tabs={tabs}
				total={total}
				loading={loading}
				searchPlaceholder={config.searchPlaceholder}
				filters={(config.filters ?? []).map((filter) => (
					<TextField
						key={filter.key}
						select
						size="small"
						label={filter.label}
						value={inquiry.filters[filter.key] ?? ALL_TAB}
						onChange={(e) => inquiry.setFilter(filter.key, e.target.value)}
						className="va-toolbar__filter"
					>
						<MenuItem value={ALL_TAB}>All</MenuItem>
						{filter.options.map((option) => (
							<MenuItem key={option} value={option}>
								{humanize(option)}
							</MenuItem>
						))}
					</TextField>
				))}
				actions={
					config.createMutation ? (
						<Button
							variant="contained"
							startIcon={<Plus size={18} weight="bold" />}
							onClick={() => setDraft({ mode: 'create' })}
						>
							Add {config.entity.toLowerCase()}
						</Button>
					) : config.createNote ? (
						<span className="va-toolbar__note">{config.createNote}</span>
					) : null
				}
			>
				<Table className="va-table">
					<TableHead>
						<TableRow>
							{config.columns.map((column) => (
								<TableCell key={column.label} align={column.align}>
									{column.label}
								</TableCell>
							))}
							<TableCell align="center">Status</TableCell>
							<TableCell align="right">Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{!loading && rows.length === 0 && (
							<TableRow>
								<TableCell colSpan={config.columns.length + 2} className="va-table__empty">
									No {config.entity.toLowerCase()}s match these filters.
								</TableCell>
							</TableRow>
						)}
						{rows.map((row) => {
							const status = String(row[config.statusField] ?? '');
							const deleted = status === config.deleteStatus;
							return (
								<TableRow hover key={row._id} className={deleted ? 'is-deleted' : undefined}>
									{config.columns.map((column) => (
										<TableCell key={column.label} align={column.align}>
											{column.render(row)}
										</TableCell>
									))}
									<TableCell align="center">
										{deleted ? (
											<StatusChip value={status} label="Deleted" />
										) : (
											<Select
												size="small"
												value={status}
												className={`va-status-select va-status-select--${status.toLowerCase()}`}
												onChange={(e) => void changeStatus(row, e.target.value)}
												renderValue={(value) => <StatusChip value={value} />}
											>
												{editableStatuses.map((option) => (
													<MenuItem key={option} value={option}>
														{humanize(option)}
													</MenuItem>
												))}
											</Select>
										)}
									</TableCell>
									<TableCell align="right" className="va-table__actions">
										{config.publicHref && !deleted && (
											<Tooltip title="View on website">
												<IconButton component={Link} href={config.publicHref(row)} target="_blank" size="small">
													<ArrowSquareOut size={18} />
												</IconButton>
											</Tooltip>
										)}
										{!deleted && (
											<>
												<Tooltip title="Edit">
													<IconButton size="small" onClick={() => setDraft({ mode: 'edit', row })}>
														<PencilSimple size={18} />
													</IconButton>
												</Tooltip>
												<Tooltip title="Delete">
													<IconButton size="small" className="va-danger" onClick={() => void remove(row)}>
														<Trash size={18} />
													</IconButton>
												</Tooltip>
											</>
										)}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</AdminListCard>

			<AdminFormDialog
				open={Boolean(draft)}
				title={draft?.mode === 'edit' ? `Edit ${config.entity.toLowerCase()}` : `New ${config.entity.toLowerCase()}`}
				fields={config.fields}
				initialValues={draftValues}
				saving={saving}
				onClose={() => setDraft(null)}
				onSubmit={(values) => void save(values)}
				validate={config.validate}
			/>
		</>
	);
}

export default AdminCatalogManager;
