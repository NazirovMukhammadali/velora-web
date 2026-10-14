import React, { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
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
	Tooltip,
} from '@mui/material';
import { PencilSimple, Plus, Trash } from 'phosphor-react';
import { GET_ALL_NOTICES_BY_ADMIN } from '../../../../apollo/admin/query';
import {
	CREATE_NOTICE_BY_ADMIN,
	REMOVE_NOTICE_BY_ADMIN,
	UPDATE_NOTICE_BY_ADMIN,
} from '../../../../apollo/admin/mutation';
import { NoticeCategory, NoticeStatus } from '../../../enums/notice.enum';
import type { Notice } from '../../../types/notice/notice';
import { sweetConfirmAlert, sweetErrorHandlingForAdmin, sweetTopSmallSuccessAlert } from '../../../sweetAlert';
import AdminListCard from '../common/AdminListCard';
import AdminFormDialog, { type AdminField, type AdminFormValues } from '../common/AdminFormDialog';
import StatusChip, { humanize } from '../common/StatusChip';
import { ALL_TAB, useAdminInquiry } from '../common/useAdminInquiry';
import { PersonCell, formatAdminDate } from '../common/cells';

type AdminNoticeManagerProps = {
	category: NoticeCategory;
	/** Singular label used in buttons and dialogs ("Notice", "FAQ"). */
	entity: string;
	/** Inquiries are written by members; admins only review / change status. */
	allowCreate?: boolean;
};

const STATUS_TABS = [
	{ value: ALL_TAB, label: 'All' },
	{ value: NoticeStatus.ACTIVE, label: 'Active' },
	{ value: NoticeStatus.HOLD, label: 'On hold' },
	{ value: NoticeStatus.DELETE, label: 'Deleted' },
];

const FIELDS: AdminField[] = [
	{ name: 'noticeTitle', label: 'Title', type: 'text', required: true, maxLength: 120 },
	{ name: 'noticeContent', label: 'Content', type: 'textarea', required: true, maxLength: 5000 },
	{ name: 'noticeStatus', label: 'Status', type: 'select', required: true, options: Object.values(NoticeStatus) },
];

type Draft = { mode: 'create' } | { mode: 'edit'; notice: Notice } | null;

const AdminNoticeManager = ({ category, entity, allowCreate = true }: AdminNoticeManagerProps) => {
	const inquiry = useAdminInquiry(
		({ tab, text }) => ({
			noticeCategory: category,
			...(tab !== ALL_TAB ? { noticeStatus: tab } : {}),
			...(text ? { text } : {}),
		}),
		{},
		{ limit: 20 },
	);

	const { data, loading, refetch } = useQuery(GET_ALL_NOTICES_BY_ADMIN, {
		fetchPolicy: 'network-only',
		notifyOnNetworkStatusChange: true,
		variables: { input: inquiry.input },
	});

	const [createNotice] = useMutation(CREATE_NOTICE_BY_ADMIN);
	const [updateNotice] = useMutation(UPDATE_NOTICE_BY_ADMIN);
	const [removeNotice] = useMutation(REMOVE_NOTICE_BY_ADMIN);
	const [draft, setDraft] = useState<Draft>(null);
	const [saving, setSaving] = useState(false);

	const notices: Notice[] = data?.getAllNoticesByAdmin?.list ?? [];
	const total: number = data?.getAllNoticesByAdmin?.metaCounter?.[0]?.total ?? 0;

	const initialValues = useMemo<AdminFormValues>(
		() =>
			draft?.mode === 'edit'
				? {
						noticeTitle: draft.notice.noticeTitle,
						noticeContent: draft.notice.noticeContent,
						noticeStatus: draft.notice.noticeStatus,
				  }
				: { noticeTitle: '', noticeContent: '', noticeStatus: NoticeStatus.ACTIVE },
		[draft],
	);

	/** HANDLERS **/
	const changeStatus = async (notice: Notice, noticeStatus: NoticeStatus) => {
		try {
			await updateNotice({ variables: { input: { _id: notice._id, noticeStatus } } });
			await refetch();
		} catch (err) {
			sweetErrorHandlingForAdmin(err).then();
		}
	};

	const deleteNotice = async (notice: Notice) => {
		try {
			if (!(await sweetConfirmAlert(`Delete "${notice.noticeTitle}" permanently?`))) return;
			await removeNotice({ variables: { noticeId: notice._id } });
			await refetch();
			sweetTopSmallSuccessAlert('Deleted', 800).then();
		} catch (err) {
			sweetErrorHandlingForAdmin(err).then();
		}
	};

	const save = async (values: AdminFormValues) => {
		if (!draft) return;
		const noticeTitle = values.noticeTitle.trim();
		const noticeContent = values.noticeContent.trim();
		const noticeStatus = values.noticeStatus as NoticeStatus;
		setSaving(true);
		try {
			if (draft.mode === 'edit') {
				await updateNotice({
					variables: { input: { _id: draft.notice._id, noticeTitle, noticeContent, noticeStatus } },
				});
			} else {
				await createNotice({
					variables: { input: { noticeCategory: category, noticeTitle, noticeContent, noticeStatus } },
				});
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

	const validate = (values: AdminFormValues) => {
		const errors: Record<string, string> = {};
		if (values.noticeTitle.trim().length < 3) errors.noticeTitle = 'At least 3 characters';
		if (values.noticeContent.trim().length < 3) errors.noticeContent = 'At least 3 characters';
		return errors;
	};

	const columns = allowCreate ? 5 : 6;

	return (
		<>
			<AdminListCard
				inquiry={inquiry}
				tabs={STATUS_TABS}
				total={total}
				loading={loading}
				searchPlaceholder="Search by title"
				actions={
					allowCreate ? (
						<Button
							variant="contained"
							startIcon={<Plus size={18} weight="bold" />}
							onClick={() => setDraft({ mode: 'create' })}
						>
							Add {entity}
						</Button>
					) : null
				}
			>
				<Table className="va-table">
					<TableHead>
						<TableRow>
							<TableCell>Title</TableCell>
							<TableCell>Content</TableCell>
							{!allowCreate && <TableCell>Member</TableCell>}
							<TableCell>Date</TableCell>
							<TableCell align="center">Status</TableCell>
							<TableCell align="right">Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{!loading && notices.length === 0 && (
							<TableRow>
								<TableCell colSpan={columns} className="va-table__empty">
									Nothing here yet.
								</TableCell>
							</TableRow>
						)}
						{notices.map((notice) => (
							<TableRow hover key={notice._id}>
								<TableCell>
									<strong className="va-clamp">{notice.noticeTitle}</strong>
								</TableCell>
								<TableCell>
									<Tooltip title={notice.noticeContent} placement="bottom-start">
										<span className="va-clamp va-muted">{notice.noticeContent}</span>
									</Tooltip>
								</TableCell>
								{!allowCreate && (
									<TableCell>
										<PersonCell member={notice.memberData} />
									</TableCell>
								)}
								<TableCell>{formatAdminDate(notice.createdAt)}</TableCell>
								<TableCell align="center">
									<Select
										size="small"
										value={notice.noticeStatus}
										className="va-status-select"
										renderValue={(value) => <StatusChip value={value} />}
										onChange={(e) => void changeStatus(notice, e.target.value as NoticeStatus)}
									>
										{Object.values(NoticeStatus).map((status) => (
											<MenuItem key={status} value={status}>
												{humanize(status)}
											</MenuItem>
										))}
									</Select>
								</TableCell>
								<TableCell align="right" className="va-table__actions">
									<Tooltip title="Edit">
										<IconButton size="small" onClick={() => setDraft({ mode: 'edit', notice })}>
											<PencilSimple size={18} />
										</IconButton>
									</Tooltip>
									<Tooltip title="Delete permanently">
										<IconButton size="small" className="va-danger" onClick={() => void deleteNotice(notice)}>
											<Trash size={18} />
										</IconButton>
									</Tooltip>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</AdminListCard>

			<AdminFormDialog
				open={Boolean(draft)}
				title={draft?.mode === 'edit' ? `Edit ${entity}` : `New ${entity}`}
				fields={FIELDS}
				initialValues={initialValues}
				saving={saving}
				onClose={() => setDraft(null)}
				onSubmit={(values) => void save(values)}
				validate={validate}
			/>
		</>
	);
};

export default AdminNoticeManager;
