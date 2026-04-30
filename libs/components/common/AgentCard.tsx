import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Link from 'next/link';
import { REACT_APP_API_URL } from '../../config';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface AgentCardProps {
	agent: any;
	likeMemberHandler: any;
}

const AgentCard = (props: AgentCardProps) => {
	const { agent, likeMemberHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = agent?.memberImage
		? `${REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUser.svg';

	const detailHref = {
		pathname: '/agent/detail',
		query: { agentId: agent?._id },
	} as const;

	const displayName = agent?.memberFullName ?? agent?.memberNick ?? 'Travel expert';

	if (device === 'mobile') {
		return <div>AGENT CARD</div>;
	}

	return (
		<article className="agent-guide-card">
			<div className="agent-guide-photo-wrap">
				<Link href={detailHref} className="agent-guide-photo-link">
					<img src={imagePath} alt="" className="agent-guide-photo" />
				</Link>
				<div
					className="agent-guide-social"
					role="group"
					aria-label="Social links"
					onClick={(e) => e.stopPropagation()}
				>
					<a href="#" aria-label="Facebook" onClick={(e) => e.preventDefault()}>
						<FacebookIcon sx={{ fontSize: 18 }} />
					</a>
					<a href="#" aria-label="Twitter" onClick={(e) => e.preventDefault()}>
						<TwitterIcon sx={{ fontSize: 18 }} />
					</a>
					<a href="#" aria-label="LinkedIn" onClick={(e) => e.preventDefault()}>
						<LinkedInIcon sx={{ fontSize: 18 }} />
					</a>
					<a href="#" aria-label="Website" onClick={(e) => e.preventDefault()}>
						<LanguageIcon sx={{ fontSize: 18 }} />
					</a>
				</div>
				<div className="agent-guide-like">
					<IconButton
						size="small"
						aria-label="Like expert"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							likeMemberHandler(user, agent?._id);
						}}
						sx={{
							color: agent?.meLiked?.[0]?.myFavorite ? '#ff6b2c' : '#424857',
							background: 'rgba(255,255,255,0.92)',
							'&:hover': { background: '#fff' },
						}}
					>
						{agent?.meLiked?.[0]?.myFavorite ? (
							<FavoriteIcon fontSize="small" color="inherit" />
						) : (
							<FavoriteBorderIcon fontSize="small" />
						)}
					</IconButton>
				</div>
			</div>

			<div className="agent-guide-badge">Tourist guide</div>

			<Link href={detailHref} className="agent-guide-name-link">
				<strong className="agent-guide-name">{displayName}</strong>
			</Link>
		</article>
	);
};

export default AgentCard;
