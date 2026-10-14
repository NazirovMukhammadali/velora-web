import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import AdminListCard from '../common/AdminListCard';
import StatusChip, { humanize } from '../common/StatusChip';
import { ALL_TAB, useAdminInquiry } from '../common/useAdminInquiry';
import { PersonCell, formatAdminDate } from '../common/cells';
import { GET_ALL_MEMBERS_BY_ADMIN } from '../../../../apollo/admin/query';
import { UPDATE_MEMBER_BY_ADMIN } from '../../../../apollo/admin/mutation';
import { MemberStatus, MemberType } from '../../../enums/member.enum';
import type { Member } from '../../../types/member/member';
import type { AdminMemberUpdate } from '../../../types/member/member.update';
import useAuth from '../../../hooks/useAuth';
import { sweetConfirmAlert, sweetErrorHandlingForAdmin, sweetTopSmallSuccessAlert } from '../../../sweetAlert';

const STATUS_TABS = [
	{ value: ALL_TAB, label: 'All' },
	{ value: MemberStatus.ACTIVE, label: 'Active' },
	{ value: MemberStatus.BLOCK, label: 'Blocked' },
	{ value: MemberStatus.DELETE, label: 'Deleted' },
];

/** Changes that lock someone out or grant full access deserve a second click. */
const needsConfirm = (update: AdminMemberUpdate) =>
	update.memberType === MemberType.ADMIN ||
	update.memberStatus === MemberStatus.BLOCK ||
	update.memberStatus === MemberStatus.DELETE;

const AdminMembersManager = () => {
	const { user } = useAuth();
	const inquiry = useAdminInquiry(
		({ tab, text, filters }) => ({
			...(tab !== ALL_TAB ? { memberStatus: tab } : {}),
			...(filters.type !== ALL_TAB ? { memberType: filters.type } : {}),
			...(text ? { text } : {}),
		}),
		{ type: ALL_TAB },
	);

	const { data, loading, refetch } = useQuery(GET_ALL_MEMBERS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		notifyOnNetworkStatusChange: true,
		variables: { input: inquiry.input },
	});
	const [updateMember] = useMutation(UPDATE_MEMBER_BY_ADMIN);
	const [busyId, setBusyId] = useState<string | null>(null);

	const members: Member[] = data?.getAllMembersByAdmin?.list ?? [];
	const total: number = data?.getAllMembersByAdmin?.metaCounter?.[0]?.total ?? 0;

	/** HANDLERS **/
	const update = async (member: Member, change: Omit<AdminMemberUpdate, '_id'>) => {
		const payload = { _id: member._id, ...change };
		if (needsConfirm(payload)) {
			const what = change.memberType
				? `make ${member.memberNick} an ${humanize(change.memberType)}`
				: `set ${member.memberNick} to ${humanize(change.memberStatus ?? '')}`;
			if (!(await sweetConfirmAlert(`Are you sure you want to ${what}?`))) return;
		}
		setBusyId(member._id);
		try {
			await updateMember({ variables: { input: payload } });
			await refetch();
			sweetTopSmallSuccessAlert('Member updated', 800).then();
		} catch (err) {
			sweetErrorHandlingForAdmin(err).then();
		} finally {
			setBusyId(null);
		}
	};

	return (
		<AdminListCard
			inquiry={inquiry}
			tabs={STATUS_TABS}
			total={total}
			loading={loading}
			searchPlaceholder="Search by nickname"
			filters={
				<TextField
					select
					size="small"
					label="Role"
					value={inquiry.filters.type}
					onChange={(e) => inquiry.setFilter('type', e.target.value)}
					className="va-toolbar__filter"
				>
					<MenuItem value={ALL_TAB}>All</MenuItem>
					{Object.values(MemberType).map((type) => (
						<MenuItem key={type} value={type}>
							{humanize(type)}
						</MenuItem>
					))}
				</TextField>
			}
		>
			<Table className="va-table">
				<TableHead>
					<TableRow>
						<TableCell>Member</TableCell>
						<TableCell>Phone</TableCell>
						<TableCell align="center">Role</TableCell>
						<TableCell align="center">Articles</TableCell>
						<TableCell align="center">Warnings</TableCell>
						<TableCell>Joined</TableCell>
						<TableCell align="center">Status</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{!loading && members.length === 0 && (
						<TableRow>
							<TableCell colSpan={7} className="va-table__empty">
								No members match these filters.
							</TableCell>
						</TableRow>
					)}
					{members.map((member) => {
						// Admins cannot demote or block themselves from this screen.
						const locked = member._id === user?._id || busyId === member._id;
						return (
							<TableRow hover key={member._id}>
								<TableCell>
									<PersonCell member={member} />
								</TableCell>
								<TableCell>{member.memberPhone || '—'}</TableCell>
								<TableCell align="center">
									<Select
										size="small"
										value={member.memberType}
										disabled={locked}
										className="va-status-select"
										renderValue={(value) => <StatusChip value={value} />}
										onChange={(e) => void update(member, { memberType: e.target.value as MemberType })}
									>
										{Object.values(MemberType).map((type) => (
											<MenuItem key={type} value={type}>
												{humanize(type)}
											</MenuItem>
										))}
									</Select>
								</TableCell>
								<TableCell align="center">{member.memberArticles ?? 0}</TableCell>
								<TableCell align="center">
									{member.memberWarnings ? <span className="va-warn">{member.memberWarnings}</span> : 0}
								</TableCell>
								<TableCell>{formatAdminDate(member.createdAt)}</TableCell>
								<TableCell align="center">
									<Select
										size="small"
										value={member.memberStatus}
										disabled={locked}
										className="va-status-select"
										renderValue={(value) => <StatusChip value={value} />}
										onChange={(e) => void update(member, { memberStatus: e.target.value as MemberStatus })}
									>
										{Object.values(MemberStatus).map((status) => (
											<MenuItem key={status} value={status}>
												{humanize(status)}
											</MenuItem>
										))}
									</Select>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</AdminListCard>
	);
};

export default AdminMembersManager;
