import React from 'react';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { Skeleton } from '@mui/material';
import VeloraImage from '../common/VeloraImage';
import { GET_AGENTS } from '../../../apollo/user/query';
import type { Member } from '../../types/member/member';
import { getAgentLocationLabel, resolveMemberImageUrl } from '../../utils/memberImage';

const EXPERTS_LIMIT = 6;
const DEFAULT_AVATAR = '/img/profile/defaultUser.svg';

/** Most-viewed agents from the live directory; each card opens that agent's real profile. */
const EXPERTS_VARIABLES = {
	input: { page: 1, limit: EXPERTS_LIMIT, sort: 'memberViews', direction: 'DESC', search: {} },
};

const TravelExperts = () => {
	const { data, loading } = useQuery<{ getAgents?: { list: Member[] } }>(GET_AGENTS, {
		fetchPolicy: 'cache-and-network',
		errorPolicy: 'all',
		variables: EXPERTS_VARIABLES,
	});

	const experts = data?.getAgents?.list ?? [];

	// Nothing to show (API down / no agents yet): hide the section instead of linking to missing profiles.
	if (!loading && experts.length === 0) return null;

	return (
		<section className={'travel-experts-section'}>
			<div className={'experts-head'}>
				<span>Meet Travel Experts</span>
				<h2>Your Trip, Guided By Verified Locals</h2>
				<p>
					Plan with seasoned travel experts who design every tour. Compare reviews, ratings, and tour packages, then
					book directly with the expert you trust.
				</p>
			</div>

			<div className={'experts-grid'}>
				{experts.length === 0
					? Array.from({ length: EXPERTS_LIMIT }, (_, index) => (
							<article className={'expert-card'} key={`skeleton-${index}`} aria-hidden>
								<Skeleton variant="circular" width={112} height={112} sx={{ mx: 'auto' }} />
								<Skeleton width="60%" sx={{ mx: 'auto', mt: 2 }} />
								<Skeleton width="40%" sx={{ mx: 'auto' }} />
							</article>
					  ))
					: experts.map((agent) => {
							const name = agent.memberFullName || agent.memberNick;
							const tours = agent.memberProperties ?? 0;
							return (
								<article className={'expert-card'} key={agent._id}>
									<div className={'expert-avatar'}>
										<VeloraImage
											src={resolveMemberImageUrl(agent.memberImage)}
											fallback={DEFAULT_AVATAR}
											alt={name}
											fill
											sizes="112px"
										/>
									</div>
									<h3>{name}</h3>
									<p>{getAgentLocationLabel(agent.memberNick, agent.memberAddress)}</p>
									<div className={'expert-meta'}>
										<span className={'rating'}>♥ {agent.memberLikes ?? 0}</span>
										<span className={'tours'}>
											{tours} {tours === 1 ? 'tour' : 'tours'}
										</span>
									</div>
									<Link
										href={{ pathname: '/agent/detail', query: { agentId: agent._id } }}
										className={'expert-cta-link'}
									>
										View Profile
									</Link>
								</article>
							);
					  })}
			</div>
		</section>
	);
};

export default TravelExperts;
