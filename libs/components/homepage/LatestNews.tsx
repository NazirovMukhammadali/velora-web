import React from 'react';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { Skeleton } from '@mui/material';
import { CalendarBlank, Clock } from 'phosphor-react';
import VeloraImage from '../common/VeloraImage';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import type { BoardArticle } from '../../types/board-article/board-article';
import { resolvePackageImage } from '../../data/packageApi';
import { formatDate } from '../../utils/date';
import { excerpt, readingMinutes } from '../../utils/article';

const FALLBACK_IMAGE = '/img/community/communityImg.png';

const NEWS_VARIABLES = {
	input: { page: 1, limit: 3, sort: 'createdAt', direction: 'DESC', search: {} },
};

const CATEGORY_LABELS: Record<string, string> = {
	FREE: 'Travel Story',
	RECOMMEND: 'Recommendation',
	NEWS: 'Travel News',
	HUMOR: 'Fun',
};

const articleHref = (article: BoardArticle) => ({
	pathname: '/community/detail',
	query: { articleCategory: article.articleCategory, id: article._id },
});

const ArticleMeta = ({ article }: { article: BoardArticle }) => (
	<div className="news-card__meta">
		<span>
			<CalendarBlank size={16} /> {formatDate(article.createdAt, 'do MMM, yyyy')}
		</span>
		<span>
			<Clock size={16} /> {readingMinutes(article.articleContent)} min read
		</span>
	</div>
);

/** Homepage "Latest News & Articles": the three newest community posts (one featured, two compact). */
const LatestNews = () => {
	const { data, loading } = useQuery<{ getBoardArticles?: { list: BoardArticle[] } }>(GET_BOARD_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		errorPolicy: 'all',
		variables: NEWS_VARIABLES,
	});

	const articles = data?.getBoardArticles?.list ?? [];
	if (!loading && articles.length === 0) return null;

	const [featured, ...rest] = articles;

	return (
		<section className="latest-news-section" aria-labelledby="latest-news-title">
			<div className="news-head">
				<span>Blog &amp; Articles</span>
				<h2 id="latest-news-title">Latest News &amp; Articles</h2>
				<p>Fresh travel stories, tips and news shared by the Velora community of travellers and local experts.</p>
			</div>

			{!featured ? (
				<div className="news-grid" aria-hidden>
					<Skeleton variant="rounded" height={460} />
					<div className="news-side">
						<Skeleton variant="rounded" height={218} />
						<Skeleton variant="rounded" height={218} />
					</div>
				</div>
			) : (
				<div className="news-grid">
					<Link href={articleHref(featured)} className="news-card news-card--featured">
						<div className="news-card__image">
							<VeloraImage
								src={resolvePackageImage(featured.articleImage)}
								fallback={FALLBACK_IMAGE}
								alt=""
								fill
								sizes="(max-width: 900px) 100vw, 45vw"
							/>
							<span className="news-card__tag">
								{CATEGORY_LABELS[featured.articleCategory] ?? featured.articleCategory}
							</span>
						</div>
						<div className="news-card__body">
							<h3>{featured.articleTitle}</h3>
							<p>{excerpt(featured.articleContent)}</p>
							<ArticleMeta article={featured} />
						</div>
					</Link>

					<div className="news-side">
						{rest.map((article) => (
							<Link key={article._id} href={articleHref(article)} className="news-card news-card--compact">
								<div className="news-card__image">
									<VeloraImage
										src={resolvePackageImage(article.articleImage)}
										fallback={FALLBACK_IMAGE}
										alt=""
										fill
										sizes="(max-width: 900px) 40vw, 20vw"
									/>
								</div>
								<div className="news-card__body">
									<span className="news-card__tag news-card__tag--inline">
										{CATEGORY_LABELS[article.articleCategory] ?? article.articleCategory}
									</span>
									<h3>{article.articleTitle}</h3>
									<ArticleMeta article={article} />
								</div>
							</Link>
						))}
					</div>
				</div>
			)}

			<p className="news-more">
				Want to see more stories from travellers?{' '}
				<Link href="/community?articleCategory=FREE">Visit the community</Link>
			</p>
		</section>
	);
};

export default LatestNews;
