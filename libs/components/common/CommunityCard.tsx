import React from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { BoardArticle } from '../../types/board-article/board-article';
import { formatDate } from '../../utils/date';
import { REACT_APP_API_URL } from '../../config';
import { userVar } from '../../../apollo/store';
import { resolveArticleImage } from '../../utils/article';
import { resolveMemberImageUrl } from '../../utils/memberImage';

interface CommunityCardProps {
	boardArticle: BoardArticle;
	/** Kept for existing callers; the card now fills its grid cell. */
	size?: string;
	likeArticleHandler: any;
}

const CATEGORY_LABELS: Record<string, string> = {
	FREE: 'Free Board',
	RECOMMEND: 'Recommendation',
	NEWS: 'News',
	HUMOR: 'Humor',
};

const PLACEHOLDER = '/img/community/communityImg.png';

const CommunityCard = ({ boardArticle, likeArticleHandler }: CommunityCardProps) => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const imagePath = resolveArticleImage(boardArticle?.articleImage, REACT_APP_API_URL);
	const liked = Boolean(boardArticle?.meLiked?.[0]?.myFavorite);
	const author = boardArticle?.memberData;

	/** HANDLERS **/
	const openArticle = () => {
		router.push(
			{
				pathname: '/community/detail',
				query: { articleCategory: boardArticle?.articleCategory, id: boardArticle?._id },
			},
			undefined,
			{ shallow: true },
		);
	};

	const goMemberPage = (id?: string) => {
		if (!id) return;
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	return (
		<article
			className="community-general-card-config"
			role="link"
			tabIndex={0}
			onClick={openArticle}
			onKeyDown={(e) => {
				if (e.key === 'Enter') openArticle();
			}}
		>
			<div className="image-box">
				{/* eslint-disable-next-line @next/next/no-img-element -- uploads come from the API host */}
				<img
					src={imagePath}
					alt=""
					className="card-img"
					loading="lazy"
					onError={(e) => {
						if (!e.currentTarget.src.endsWith(PLACEHOLDER)) e.currentTarget.src = PLACEHOLDER;
					}}
				/>
				<span className="date-box">
					<strong>{formatDate(boardArticle?.createdAt, 'dd')}</strong>
					<span>{formatDate(boardArticle?.createdAt, 'MMM')}</span>
				</span>
				<span className="category-chip">
					{CATEGORY_LABELS[boardArticle?.articleCategory] ?? boardArticle?.articleCategory}
				</span>
			</div>

			<div className="desc-box">
				<h3 className="title">{boardArticle?.articleTitle}</h3>

				<div className="card-foot">
					<button
						type="button"
						className="author"
						onClick={(e) => {
							e.stopPropagation();
							goMemberPage(author?._id);
						}}
					>
						<Avatar src={resolveMemberImageUrl(author?.memberImage)} alt="" sx={{ width: 28, height: 28 }} />
						<span>{author?.memberNick}</span>
					</button>

					<div className="buttons">
						<span className="stat">
							<RemoveRedEyeOutlinedIcon />
							{boardArticle?.articleViews ?? 0}
						</span>
						<IconButton
							size="small"
							className={`like ${liked ? 'is-liked' : ''}`}
							aria-label={liked ? 'Unlike' : 'Like'}
							onClick={(e) => {
								e.stopPropagation();
								likeArticleHandler(user, boardArticle?._id);
							}}
						>
							{liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
						</IconButton>
						<span className="stat stat--likes">{boardArticle?.articleLikes ?? 0}</span>
					</div>
				</div>
			</div>
		</article>
	);
};

export default CommunityCard;
