import Link from 'next/link';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import type { Member } from '../../types/member/member';
import VeloraImage from '../common/VeloraImage';
import { getAgentLocationLabel, resolveMemberImageUrl } from '../../utils/memberImage';

type AgentListCardProps = {
	agent: Member;
	likeCount?: number;
	liked?: boolean;
	onLike?: () => void;
};

const AgentListCard = ({ agent, likeCount, liked = false, onLike }: AgentListCardProps) => {
	const imagePath = resolveMemberImageUrl(agent.memberImage);

	const detailHref = {
		pathname: '/agent/detail',
		query: { agentId: agent._id },
	} as const;

	const displayName = agent.memberFullName ?? agent.memberNick ?? 'Travel expert';
	const location = getAgentLocationLabel(agent.memberNick, agent.memberAddress);
	const tourCount = agent.memberProperties ?? 0;
	const badgeLabel = `${tourCount} ${tourCount === 1 ? 'tour' : 'tours'}`;
	const views = agent.memberViews ?? 0;
	const likes = likeCount ?? agent.memberLikes ?? 0;
	const rating =
		agent.memberRank && agent.memberRank > 0 ? (agent.memberRank / 10).toFixed(1) : null;

	return (
		<article className="agent-portrait-card">
			<div className="agent-portrait-card__shell">
				<Link href={detailHref} className="agent-portrait-card__photo">
					<VeloraImage
						src={imagePath}
						alt={displayName}
						fill
						sizes="(max-width: 768px) 50vw, 25vw"
						className="agent-portrait-card__img"
					/>
					<span className="agent-portrait-card__badge">{badgeLabel}</span>
					{rating && <span className="agent-portrait-card__rating">★ {rating}</span>}
				</Link>

				<div className="agent-portrait-card__foot">
					<Link href={detailHref} className="agent-portrait-card__identity">
						<strong title={displayName}>{displayName}</strong>
						<span>{location}</span>
					</Link>

					<div className="agent-portrait-card__stats">
						<span className="agent-portrait-card__stat" title={`${views} views`}>
							<RemoveRedEyeIcon sx={{ fontSize: 18 }} />
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
								<FavoriteIcon sx={{ fontSize: 18 }} />
							) : (
								<FavoriteBorderIcon sx={{ fontSize: 18 }} />
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
