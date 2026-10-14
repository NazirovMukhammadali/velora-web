import React from 'react';
import Link from 'next/link';
import { POPULAR_DESTINATIONS } from '../../data/popularDestinations';
import VeloraImage from '../common/VeloraImage';

const PopularDestinations = () => {
	return (
		<section className={'popular-destinations-section'}>
			<div className={'destinations-head'}>
				<span className={'destinations-eyebrow'}>Next adventure destination</span>
				<h2>Popular travel destinations worldwide</h2>
				<p>
					From city breaks to coastlines — explore curated routes and tour ideas. Tap a destination to browse matching
					packages.
				</p>
			</div>

			<div className={'destinations-grid'}>
				{POPULAR_DESTINATIONS.map((d) => (
					<Link
						href={`/tours?location=${encodeURIComponent(d.name)}`}
						key={d.slug}
						className={'destination-card'}
						scroll={true}
					>
						<div className={'destination-card-inner'}>
							<div className={'destination-card-image'}>
								<div className={'destination-card-photo'}>
									<VeloraImage src={d.image} alt={d.name} fill sizes="(max-width: 768px) 100vw, 25vw" />
								</div>
								<span className={'destination-badge'}>{d.tourCount.toString().padStart(2, '0')} Tours</span>
							</div>
							<h3>{d.name}</h3>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
};

export default PopularDestinations;
