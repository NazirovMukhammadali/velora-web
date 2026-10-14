import React, { ChangeEvent, useState } from 'react';
import { NextPage } from 'next';
import Image from 'next/image';
import { Pagination, Stack, Typography } from '@mui/material';
import CommunityCard from '../common/CommunityCard';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { BoardArticle, BoardArticles } from '../../types/board-article/board-article';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../../apollo/user/mutation';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { Messages } from '../../config';
import { sweetMixinErrorAlert } from '../../sweetAlert';

const MyArticles: NextPage = ({ initialInput }: any) => {
	const user = useReactiveVar(userVar);
	const [searchCommunity, setSearchCommunity] = useState({
		...initialInput,
		search: { memberId: user._id },
	});
	const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

	const { refetch: boardArticlesRefetch } = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { input: searchCommunity },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: { getBoardArticles?: BoardArticles }) => {
			setBoardArticles(data?.getBoardArticles?.list ?? []);
			setTotalCount(data?.getBoardArticles?.metaCounter?.[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (_e: ChangeEvent<unknown>, value: number) => {
		setSearchCommunity({ ...searchCommunity, page: value });
	};

	const likeArticleHandler = async (user: any, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetBoardArticle({ variables: { input: id } });

			await boardArticlesRefetch({ input: searchCommunity });
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	return (
		<div id="my-articles-page">
			<Stack className="main-title-box">
				<Stack className="right-box">
					<Typography className="main-title">Article</Typography>
					<Typography className="sub-title">We are glad to see you again!</Typography>
				</Stack>
			</Stack>
			<Stack className="article-list-box">
				{boardArticles?.length > 0 ? (
					boardArticles?.map((boardArticle: BoardArticle) => {
						return (
							<CommunityCard
								boardArticle={boardArticle}
								key={boardArticle?._id}
								size={'small'}
								likeArticleHandler={likeArticleHandler}
							/>
						);
					})
				) : (
					<div className={'no-data'}>
						<Image src="/img/icons/icoAlert.svg" alt="" width={56} height={56} />
						<p>No Articles found!</p>
					</div>
				)}
			</Stack>

			{boardArticles?.length > 0 && (
				<Stack className="pagination-conf">
					<Stack className="pagination-box">
						<Pagination
							count={Math.ceil(totalCount / searchCommunity.limit)}
							page={searchCommunity.page}
							shape="circular"
							color="primary"
							onChange={paginationHandler}
						/>
					</Stack>
					<Stack className="total">
						<Typography>Total {totalCount ?? 0} article(s) available</Typography>
					</Stack>
				</Stack>
			)}
		</div>
	);
};

MyArticles.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default MyArticles;
