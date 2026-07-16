import React from 'react';
import Link from 'next/link';
import VeloraImage from '../common/VeloraImage';

type TravelExpert = {
	name: string;
	role: string;
	rating: string;
	tours: string;
	image: string;
};

const experts: TravelExpert[] = [
	{
		name: 'Adam Ferguson',
		role: 'Mountains & Trekking',
		rating: '4.9',
		tours: '32 tours',
		image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
	},
	{
		name: 'Sara Jameson',
		role: 'City Tours & Culture',
		rating: '4.8',
		tours: '28 tours',
		image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
	},
	{
		name: 'Liam O.Brien',
		role: 'Beach & Islands',
		rating: '4.9',
		tours: '40 tours',
		image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
	},
	{
		name: 'Nora Park',
		role: 'Family Adventures',
		rating: '4.7',
		tours: '21 tours',
		image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
	},
	{
		name: 'Carlos Rivera',
		role: 'Food & Wine Trails',
		rating: '4.9',
		tours: '35 tours',
		image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
	},
	{
		name: 'Mei Tanaka',
		role: 'Heritage & Temples',
		rating: '4.8',
		tours: '26 tours',
		image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80',
	},
];

const TravelExperts = () => {
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
				{experts.map((expert) => (
					<article className={'expert-card'} key={expert.name}>
						<div className={'expert-avatar'}>
							<VeloraImage src={expert.image} alt={expert.name} fill sizes="112px" />
						</div>
						<h3>{expert.name}</h3>
						<p>{expert.role}</p>
						<div className={'expert-meta'}>
							<span className={'rating'}>★ {expert.rating}</span>
							<span className={'tours'}>{expert.tours}</span>
						</div>
						<Link href={'/agent'} className={'expert-cta-link'}>
							View Profile
						</Link>
					</article>
				))}
			</div>
		</section>
	);
};

export default TravelExperts;
