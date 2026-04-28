import React from 'react';

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
		image: '/img/profile/defaultUser.svg',
	},
	{
		name: 'Sara Jameson',
		role: 'City Tours & Culture',
		rating: '4.8',
		tours: '28 tours',
		image: '/img/profile/defaultUser.svg',
	},
	{
		name: 'Liam O.Brien',
		role: 'Beach & Islands',
		rating: '4.9',
		tours: '40 tours',
		image: '/img/profile/defaultUser.svg',
	},
	{
		name: 'Nora Park',
		role: 'Family Adventures',
		rating: '4.7',
		tours: '21 tours',
		image: '/img/profile/defaultUser.svg',
	},
	{
		name: 'Carlos Rivera',
		role: 'Food & Wine Trails',
		rating: '4.9',
		tours: '35 tours',
		image: '/img/profile/defaultUser.svg',
	},
	{
		name: 'Mei Tanaka',
		role: 'Heritage & Temples',
		rating: '4.8',
		tours: '26 tours',
		image: '/img/profile/defaultUser.svg',
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
							<img src={expert.image} alt={expert.name} />
						</div>
						<h3>{expert.name}</h3>
						<p>{expert.role}</p>
						<div className={'expert-meta'}>
							<span className={'rating'}>★ {expert.rating}</span>
							<span className={'tours'}>{expert.tours}</span>
						</div>
						<button type={'button'} className={'expert-cta'}>
							View Profile
						</button>
					</article>
				))}
			</div>
		</section>
	);
};

export default TravelExperts;
