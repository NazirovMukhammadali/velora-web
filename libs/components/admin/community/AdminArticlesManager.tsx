import React, { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery } from '@apollo/client';
import {
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
import { ArrowSquareOut, Eye, Heart, Trash } from 'phosphor-react';
import AdminListCard from '../common/AdminListCard';
import StatusChip, { humanize } from '../common/StatusChip';
import { ALL_TAB, useAdminInquiry } from '../common/useAdminInquiry';
import { ItemCell, PersonCell, formatAdminDate } from '../common/cells';
import { GET_ALL_BOARD_ARTICLES_BY_ADMIN } from '../../../../apollo/admin/query';
import { REMOVE_BOARD_ARTICLE_BY_ADMIN, UPDATE_BOARD_ARTICLE_BY_ADMIN } from '../../../../apollo/admin/mutation';
import { BoardArticleCategory, BoardArticleStatus } from '../../../enums/board-article.enum';
import type { BoardArticle } from '../../../types/board-article/board-article';
import { sweetConfirmAlert, sweetErrorHandlingForAdmin, sweetTopSmallSuccessAlert } from '../../../sweetAlert';

const STATUS_TABS = [
	{ value: ALL_TAB, label: 'All' },
	{ value: BoardArticleStatus.ACTIVE, label: 'Published' },
	{ value: BoardArticleStatus.DELETE, label: 'Deleted' },
];

const AdminArticlesManager = () => {
	const inquiry = useAdminInquiry(
		({ tab, text, filters }) => ({
			...(tab !== ALL_TAB ? { articleStatus: tab } : {}),
			...(text ? { text } : {}),
			...(filters.category !== ALL_TAB ? { articleCategory: filters.category } : {}),
		}),
		{ category: ALL_TAB },
	);

	const { data, loading, refetch } = useQuery(GET_ALL_BOARD_ARTICLES_BY_ADMIN, {
		fetchPolicy: 'network-only',
		notifyOnNetworkStatusChange: true,
		variables: { input: inquiry.input },
	});
	const [updateArticle] = useMutation(UPDATE_BOARD_ARTICLE_BY_ADMIN);
	const [removeArticle] = useMutation(REMOVE_BOARD_ARTICLE_BY_ADMIN);
	const [busyId, setBusyId] = useState<string | null>(null);

	const articles: BoardArticle[] = data?.getAllBoardArticlesByAdmin?.list ?? [];
	const total: number = data?.getAllBoardArticlesByAdmin?.metaCounter?.[0]?.total ?? 0;

	/** HANDLERS **/
	const run = async (id: string, job: () => Promise<unknown>, done: string) => {
		setBusyId(id);
		try {
			await job();
			await refetch();
			sweetTopSmallSuccessAlert(done, 800).then();
		} catch (err) {
			sweetErrorHandlingForAdmin(err).then();
		} finally {
			setBusyId(null);
		}
	};

	const changeStatus = (article: BoardArticle, articleStatus: BoardArticleStatus) =>
		run(
			article._id,
			() => updateArticle({ variables: { input: { _id: article._id, articleStatus } } }),
			'Article updated',
		);

	const removeForever = async (article: BoardArticle) => {
		if (!(await sweetConfirmAlert(`Permanently remove “${article.articleTitle}”? This cannot be undone.`))) return;
		await run(article._id, () => removeArticle({ variables: { input: article._id } }), 'Article removed');
	};

	return (
		<AdminListCard
			inquiry={inquiry}
			tabs={STATUS_TABS}
			total={total}
			loading={loading}
			searchPlaceholder="Search by title"
			filters={
				<TextField
					select
					size="small"
					label="Category"
					value={inquiry.filters.category}
					onChange={(e) => inquiry.setFilter('category', e.target.value)}
					className="va-toolbar__filter"
				>
					<MenuItem value={ALL_TAB}>All</MenuItem>
					{Object.values(BoardArticleCategory).map((category) => (
						<MenuItem key={category} value={category}>
							{humanize(category)}
						</MenuItem>
					))}
				</TextField>
			}
		>
			<Table className="va-table">
				<TableHead>
					<TableRow>
						<TableCell>Article</TableCell>
						<TableCell>Author</TableCell>
						<TableCell align="center">Engagement</TableCell>
						<TableCell>Published</TableCell>
						<TableCell align="center">Status</TableCell>
						<TableCell align="right">Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{!loading && articles.length === 0 && (
						<TableRow>
							<TableCell colSpan={6} className="va-table__empty">
								No articles match these filters.
							</TableCell>
						</TableRow>
					)}
					{articles.map((article) => {
						const deleted = article.articleStatus === BoardArticleStatus.DELETE;
						return (
							<TableRow hover key={article._id} className={deleted ? 'is-deleted' : undefined}>
								<TableCell>
									<ItemCell
										image={article.articleImage}
										title={article.articleTitle}
										subtitle={humanize(article.articleCategory)}
									/>
								</TableCell>
								<TableCell>
									<PersonCell member={article.memberData} />
								</TableCell>
								<TableCell align="center">
									<span className="va-metrics">
										<span>
											<Eye size={15} /> {article.articleViews ?? 0}
										</span>
										<span>
											<Heart size={15} /> {article.articleLikes ?? 0}
										</span>
									</span>
								</TableCell>
								<TableCell>{formatAdminDate(article.createdAt)}</TableCell>
								<TableCell align="center">
									<Select
										size="small"
										value={article.articleStatus}
										disabled={busyId === article._id}
										className="va-status-select"
										renderValue={(value) => (
											<StatusChip value={value} label={value === BoardArticleStatus.ACTIVE ? 'Published' : 'Deleted'} />
										)}
										onChange={(e) => void changeStatus(article, e.target.value as BoardArticleStatus)}
									>
										<MenuItem value={BoardArticleStatus.ACTIVE}>Published</MenuItem>
										<MenuItem value={BoardArticleStatus.DELETE}>Deleted (hidden)</MenuItem>
									</Select>
								</TableCell>
								<TableCell align="right" className="va-table__actions">
									{!deleted && (
										<Tooltip title="View on website">
											<IconButton
												size="small"
												component={Link}
												href={`/community/detail?articleCategory=${article.articleCategory}&id=${article._id}`}
												target="_blank"
											>
												<ArrowSquareOut size={18} />
											</IconButton>
										</Tooltip>
									)}
									{deleted && (
										<Tooltip title="Remove permanently">
											<IconButton
												size="small"
												className="va-danger"
												disabled={busyId === article._id}
												onClick={() => void removeForever(article)}
											>
												<Trash size={18} />
											</IconButton>
										</Tooltip>
									)}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</AdminListCard>
	);
};

export default AdminArticlesManager;
