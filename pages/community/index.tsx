import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Stack, Tab, Typography, Button, Pagination } from '@mui/material';
import CommunityCard from '../../libs/components/common/CommunityCard';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { BoardArticle, BoardArticles } from '../../libs/types/board-article/board-article';
import type { CustomJwtPayload } from '../../libs/types/customJwtPayload';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticlesInquiry } from '../../libs/types/board-article/board-article.input';
import { BoardArticleCategory } from '../../libs/enums/board-article.enum';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../apollo/user/mutation';
import { useMutation, useQuery } from '@apollo/client';
import { GET_BOARD_ARTICLES } from '../../apollo/user/query';
import { Message } from '../../libs/enums/common.enum';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Community: NextPage = ({ initialInput }: any) => {
	const router = useRouter();
	const { query } = router;
	const articleCategory = query?.articleCategory as string;
	const [searchCommunity, setSearchCommunity] = useState<BoardArticlesInquiry>(initialInput);
	const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

	const { refetch: boardArticlesRefetch } = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		errorPolicy: 'all',
		variables: { input: searchCommunity },
		// Wait until the tab state matches the URL so a deep link doesn't fetch FREE first.
		skip: !router.isReady || searchCommunity.search.articleCategory !== articleCategory,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: { getBoardArticles?: BoardArticles }) => {
			setBoardArticles(data?.getBoardArticles?.list ?? []);
			setTotalCount(data?.getBoardArticles?.metaCounter?.[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	// The URL is the source of truth for the active tab (deep links, refresh, Back/Forward).
	useEffect(() => {
		if (!router.isReady) return;
		const isKnownCategory = Object.values(BoardArticleCategory).includes(articleCategory as BoardArticleCategory);
		if (!isKnownCategory) {
			void router.replace(
				{ pathname: router.pathname, query: { articleCategory: BoardArticleCategory.FREE } },
				undefined,
				{ shallow: true },
			);
			return;
		}
		setSearchCommunity((prev) =>
			prev.search.articleCategory === articleCategory
				? prev
				: { ...prev, page: 1, search: { articleCategory: articleCategory as BoardArticleCategory } },
		);
	}, [router, articleCategory]);

	/** HANDLERS **/
	const likeBoardArticleHandler = async (user: CustomJwtPayload, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetBoardArticle({ variables: { input: id } });

			await boardArticlesRefetch({ input: searchCommunity });
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const tabChangeHandler = async (_e: SyntheticEvent, value: string) => {
		await router.push(
			{
				pathname: '/community',
				query: { articleCategory: value },
			},
			undefined,
			{ shallow: true },
		);
	};

	const paginationHandler = (_e: ChangeEvent<unknown>, value: number) => {
		setSearchCommunity({ ...searchCommunity, page: value });
	};

	return (
		<div id="community-list-page">
			<div className="container">
				<TabContext value={searchCommunity.search.articleCategory ?? 'FREE'}>
					<Stack className="main-box">
						<Stack className="left-config">
							<Stack className={'image-info'}>
								<Image src={'/img/logo/velora-mark.svg'} alt={'Velora'} width={48} height={48} />
								<Stack className={'community-name'}>
									<Typography className={'name'}>Velora Community</Typography>
								</Stack>
							</Stack>

							<TabList
								orientation="vertical"
								aria-label="lab API tabs example"
								TabIndicatorProps={{
									style: { display: 'none' },
								}}
								onChange={tabChangeHandler}
							>
								<Tab
									value={'FREE'}
									label={'Free Board'}
									className={`tab-button ${searchCommunity.search.articleCategory == 'FREE' ? 'active' : ''}`}
								/>
								<Tab
									value={'RECOMMEND'}
									label={'Recommendation'}
									className={`tab-button ${searchCommunity.search.articleCategory == 'RECOMMEND' ? 'active' : ''}`}
								/>
								<Tab
									value={'NEWS'}
									label={'News'}
									className={`tab-button ${searchCommunity.search.articleCategory == 'NEWS' ? 'active' : ''}`}
								/>
								<Tab
									value={'HUMOR'}
									label={'Humor'}
									className={`tab-button ${searchCommunity.search.articleCategory == 'HUMOR' ? 'active' : ''}`}
								/>
							</TabList>
						</Stack>
						<Stack className="right-config">
							<Stack className="panel-config">
								<Stack className="title-box">
									<Stack className="left">
										<Typography className="title">{searchCommunity.search.articleCategory} BOARD</Typography>
										<Typography className="sub-title">
											Express your opinions freely here without content restrictions
										</Typography>
									</Stack>
									<Button
										onClick={() =>
											router.push({
												pathname: '/mypage',
												query: {
													category: 'writeArticle',
												},
											})
										}
										className="right"
									>
										Write
									</Button>
								</Stack>

								<TabPanel value="FREE">
									<Stack className="list-box">
										{totalCount ? (
											boardArticles?.map((boardArticle: BoardArticle) => {
												return (
													<CommunityCard
														boardArticle={boardArticle}
														key={boardArticle?._id}
														likeArticleHandler={likeBoardArticleHandler}
													/>
												);
											})
										) : (
											<Stack className={'no-data'}>
												<Image src="/img/icons/icoAlert.svg" alt="" width={56} height={56} />
												<p>No Article found!</p>
											</Stack>
										)}
									</Stack>
								</TabPanel>
								<TabPanel value="RECOMMEND">
									<Stack className="list-box">
										{totalCount ? (
											boardArticles?.map((boardArticle: BoardArticle) => {
												return (
													<CommunityCard
														boardArticle={boardArticle}
														key={boardArticle?._id}
														likeArticleHandler={likeBoardArticleHandler}
													/>
												);
											})
										) : (
											<Stack className={'no-data'}>
												<Image src="/img/icons/icoAlert.svg" alt="" width={56} height={56} />
												<p>No Article found!</p>
											</Stack>
										)}
									</Stack>
								</TabPanel>
								<TabPanel value="NEWS">
									<Stack className="list-box">
										{totalCount ? (
											boardArticles?.map((boardArticle: BoardArticle) => {
												return (
													<CommunityCard
														boardArticle={boardArticle}
														key={boardArticle?._id}
														likeArticleHandler={likeBoardArticleHandler}
													/>
												);
											})
										) : (
											<Stack className={'no-data'}>
												<Image src="/img/icons/icoAlert.svg" alt="" width={56} height={56} />
												<p>No Article found!</p>
											</Stack>
										)}
									</Stack>
								</TabPanel>
								<TabPanel value="HUMOR">
									<Stack className="list-box">
										{totalCount ? (
											boardArticles?.map((boardArticle: BoardArticle) => {
												return (
													<CommunityCard
														boardArticle={boardArticle}
														key={boardArticle?._id}
														likeArticleHandler={likeBoardArticleHandler}
													/>
												);
											})
										) : (
											<Stack className={'no-data'}>
												<Image src="/img/icons/icoAlert.svg" alt="" width={56} height={56} />
												<p>No Article found!</p>
											</Stack>
										)}
									</Stack>
								</TabPanel>
							</Stack>
						</Stack>
					</Stack>
				</TabContext>

				{totalCount > 0 && (
					<Stack className="pagination-config">
						<Stack className="pagination-box">
							<Pagination
								count={Math.ceil(totalCount / searchCommunity.limit)}
								page={searchCommunity.page}
								shape="circular"
								color="primary"
								onChange={paginationHandler}
							/>
						</Stack>
						<Stack className="total-result">
							<Typography>
								Total {totalCount} article{totalCount > 1 ? 's' : ''} available
							</Typography>
						</Stack>
					</Stack>
				)}
			</div>
		</div>
	);
};

Community.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			articleCategory: 'FREE',
		},
	},
};

export default withLayoutBasic(Community);
