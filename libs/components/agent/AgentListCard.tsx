import Link from 'next/link';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import type { Member } from '../../types/member/member';
import { REACT_APP_API_URL } from '../../config';

type AgentListCardProps = {
	agent: Member;
	useExternalImage?: boolean;
	likeCount?: number;
	liked?: boolean;
	onLike?: () => void;
};

const AgentListCard = ({
	agent,
	useExternalImage = false,
	likeCount,
	liked = false,
	onLike,
}: AgentListCardProps) => {
	const imagePath = useExternalImage
		? agent.memberImage || '/img/profile/defaultUser.svg'
		: agent?.memberImage
			? `${REACT_APP_API_URL}/${agent.memberImage}`
			: '/img/profile/defaultUser.svg';

	const detailHref = {
		pathname: '/agent/detail',
		query: { agentId: agent._id },
	} as const;

	const displayName = agent.memberFullName ?? agent.memberNick ?? 'Travel expert';
	const tourCount = agent.memberProperties ?? 0;
	const badgeLabel = `${tourCount} ${tourCount === 1 ? 'tour' : 'tours'}`;
	const views = agent.memberViews ?? 0;
	const likes = likeCount ?? agent.memberLikes ?? 0;

	return (
		<article className="agent-portrait-card">
			<div className="agent-portrait-card__shell">
				<Link href={detailHref} className="agent-portrait-card__photo">
					<img src={imagePath} alt={displayName} />
					<span className="agent-portrait-card__badge">{badgeLabel}</span>
				</Link>

				<div className="agent-portrait-card__foot">
					<Link href={detailHref} className="agent-portrait-card__identity">
						<strong title={displayName}>{displayName}</strong>
						<span>Agent</span>
					</Link>

					<div className="agent-portrait-card__stats">
						<span className="agent-portrait-card__stat" title={`${views} views`}>
							<RemoveRedEyeIcon sx={{ fontSize: 20 }} />
							<em>{views}</em>
						</span>
						<button
							type="button"
							className={`agent-portrait-card__stat agent-portrait-card__like ${liked ? 'is-liked' : ''}`}
							aria-label={liked ? 'Remove from favorites' : 'Save expert'}
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onLike?.();
							}}
						>
							{liked ? (
								<FavoriteIcon sx={{ fontSize: 20 }} />
							) : (
								<FavoriteBorderIcon sx={{ fontSize: 20 }} />
							)}
							<em>{likes}</em>
						</button>
					</div>
				</div>
			</div>
		</article>
	);
};

export default AgentListCard;
