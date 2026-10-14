import React, { useState } from 'react';
import { Stack, Box, CircularProgress, Pagination } from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_NOTICES, GET_NOTICE } from '../../../apollo/user/query';
import { Notice as NoticeType } from '../../types/notice/notice';
import { NoticeCategory } from '../../enums/notice.enum';
import { formatDate } from '../../utils/date';
import { T } from '../../types/common';

const Notice = () => {
	const [page, setPage] = useState(1);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const limit = 10;

	const {
		data: listData,
		loading: listLoading,
		error: listError,
		refetch,
	} = useQuery(GET_NOTICES, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				page,
				limit,
				sort: 'createdAt',
				direction: 'DESC',
				search: {},
			},
		},
		notifyOnNetworkStatusChange: true,
	});

	const {
		data: detailData,
		loading: detailLoading,
		error: detailError,
	} = useQuery(GET_NOTICE, {
		skip: !selectedId,
		fetchPolicy: 'cache-and-network',
		variables: { noticeId: selectedId },
	});

	const notices: NoticeType[] = listData?.getNotices?.list ?? [];
	const total = listData?.getNotices?.metaCounter?.[0]?.total ?? 0;
	const selected: NoticeType | null = detailData?.getNotice ?? null;

	const openNotice = (id: string) => {
		setSelectedId((prev) => (prev === id ? null : id));
	};

	return (
		<Stack className={'notice-content'}>
			<span className={'title'}>Notice</span>

			{listLoading && !listData ? (
				<Stack className={'cs-state'} alignItems="center" py={6}>
					<CircularProgress size={28} />
					<p>Loading notices…</p>
				</Stack>
			) : null}

			{listError ? (
				<Stack className={'cs-state cs-state--error'} alignItems="center" py={6} gap={1}>
					<p>Could not load notices.</p>
					<button type="button" className="cs-retry" onClick={() => refetch()}>
						Try again
					</button>
				</Stack>
			) : null}

			{!listLoading && !listError && notices.length === 0 ? (
				<Stack className={'cs-state'} alignItems="center" py={6}>
					<p>No notices yet. Check back soon for travel updates.</p>
				</Stack>
			) : null}

			{!listError && notices.length > 0 ? (
				<Stack className={'main'}>
					<Box component={'div'} className={'top'}>
						<span>number</span>
						<span>title</span>
						<span>date</span>
					</Box>
					<Stack className={'bottom'}>
						{notices.map((ele: NoticeType, index: number) => {
							const isEvent = ele.noticeCategory === NoticeCategory.EVENT;
							const rowNumber = (page - 1) * limit + index + 1;
							const isOpen = selectedId === ele._id;

							return (
								<React.Fragment key={ele._id}>
									<div
										className={`notice-card ${isEvent ? 'event' : ''} ${isOpen ? 'is-open' : ''}`}
										onClick={() => openNotice(ele._id)}
										role="button"
										tabIndex={0}
										onKeyDown={(e: React.KeyboardEvent) => {
											if (e.key === 'Enter' || e.key === ' ') openNotice(ele._id);
										}}
									>
										{isEvent ? <div>event</div> : <span className={'notice-number'}>{rowNumber}</span>}
										<span className={'notice-title'}>{ele.noticeTitle}</span>
										<span className={'notice-date'}>{formatDate(ele.createdAt, 'dd.MM.yyyy')}</span>
									</div>
									{isOpen ? (
										<Box component="div" className="notice-detail">
											{detailLoading && !selected ? (
												<Stack alignItems="center" py={2}>
													<CircularProgress size={22} />
												</Stack>
											) : null}
											{detailError ? <p className="notice-detail__error">Could not load notice details.</p> : null}
											{selected && selected._id === ele._id ? (
												<p className="notice-detail__body">{selected.noticeContent}</p>
											) : null}
										</Box>
									) : null}
								</React.Fragment>
							);
						})}
					</Stack>
					{total > limit ? (
						<Stack className="pagination" mt={3}>
							<Pagination
								page={page}
								count={Math.ceil(total / limit)}
								onChange={(_e: T, value: number) => {
									setPage(value);
									setSelectedId(null);
								}}
								color="secondary"
							/>
						</Stack>
					) : null}
				</Stack>
			) : null}
		</Stack>
	);
};

export default Notice;
