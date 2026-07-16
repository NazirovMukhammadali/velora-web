import { useState } from 'react';
import Link from 'next/link';
import type { VeloraPackage } from '../../types/package';
import { formatPackagePrice, getPackageReviewsLabel } from '../../data/packages';
import PackageBookingPanel from './PackageBookingPanel';
import VeloraImage from '../common/VeloraImage';

type PackageGalleryImageProps = {
	src: string;
	alt: string;
	fallback: string;
};

const PackageGalleryImage = ({ src, alt, fallback }: PackageGalleryImageProps) => (
	<VeloraImage src={src} alt={alt} fallback={fallback} fill sizes="(max-width: 768px) 100vw, 50vw" />
);

type PackageDetailViewProps = {
	pkg: VeloraPackage;
};

const PackageDetailView = ({ pkg }: PackageDetailViewProps) => {
	const [openDay, setOpenDay] = useState(0);
	const reviewsLabel = getPackageReviewsLabel(pkg.reviewCount);
	const listLabel = pkg.type === 'tours' ? 'Tours' : pkg.type === 'hotels' ? 'Hotels' : 'Rentals';
	const listHref = pkg.type === 'tours' ? '/tours' : pkg.type === 'hotels' ? '/hotels' : '/rentcar';
	const reviewLabels =
		pkg.type === 'cars'
			? ['Pickup', 'Cleanliness', 'Condition', 'Price', 'Support']
			: pkg.type === 'hotels'
				? ['Location', 'Amenities', 'Services', 'Price', 'Rooms']
				: ['Guide', 'Itinerary', 'Value', 'Organization', 'Experience'];

	return (
		<div className={'pkg-detail-page'}>
			<nav className={'pkg-breadcrumb'} aria-label="Breadcrumb">
				<Link href="/">Home</Link>
				<span>›</span>
				<Link href={listHref}>{listLabel}</Link>
				<span>›</span>
				<span>{pkg.title}</span>
			</nav>

			<header className={'pkg-detail-hero'}>
				<div>
					<h1>{pkg.title}</h1>
					<p className={'pkg-detail-location'}>📍 {pkg.location}</p>
					<p className={'pkg-detail-rating'}>
						★ {pkg.rating.toFixed(1)} ({reviewsLabel})
					</p>
				</div>
				<div className={'pkg-detail-price-head'}>
					<span>From</span>
					<strong>
						{formatPackagePrice(pkg.priceAmount)}
						<em>{pkg.priceUnit}</em>
					</strong>
				</div>
			</header>

			<div className={'pkg-gallery'}>
				<div className={'pkg-gallery-main'}>
					<PackageGalleryImage src={pkg.gallery[0]} alt={pkg.title} fallback={pkg.image} />
				</div>
				<div className={'pkg-gallery-side'}>
					<div className={'pkg-gallery-thumb pkg-gallery-thumb--wide'}>
						<PackageGalleryImage src={pkg.gallery[1]} alt="" fallback={pkg.image} />
						<span className={'pkg-gallery-play'} aria-hidden>
							▶
						</span>
					</div>
					<div className={'pkg-gallery-row'}>
						<div className={'pkg-gallery-thumb'}>
							<PackageGalleryImage src={pkg.gallery[2]} alt="" fallback={pkg.image} />
						</div>
						<div className={'pkg-gallery-thumb'}>
							<PackageGalleryImage src={pkg.gallery[3]} alt="" fallback={pkg.image} />
						</div>
					</div>
				</div>
			</div>

			<div className={'pkg-meta-bar'}>
				<div>
					<span>{pkg.type === 'cars' ? 'Rate' : 'Duration'}</span>
					<strong>{pkg.durationLabel}</strong>
				</div>
				<div>
					<span>{pkg.type === 'cars' ? 'Category' : 'Type'}</span>
					<strong>{pkg.experienceType}</strong>
				</div>
				<div>
					<span>{pkg.type === 'cars' ? 'Seats' : 'Group Size'}</span>
					<strong>{pkg.groupSize}</strong>
				</div>
				<div>
					<span>{pkg.type === 'cars' ? 'Transmission' : 'Languages'}</span>
					<strong>{pkg.languages}</strong>
				</div>
			</div>

			<div className={'pkg-detail-layout'}>
				<div className={'pkg-detail-main'}>
					<section>
						<h2>About This {pkg.type === 'hotels' ? 'Stay' : pkg.type === 'cars' ? 'Rental' : 'Tour'}</h2>
						<p>{pkg.about}</p>
					</section>

					<section>
						<h2>Trip Highlights</h2>
						<ul className={'pkg-check-list'}>
							{pkg.highlights.map((item) => (
								<li key={item}>{item}</li>
							))}
						</ul>
					</section>

					<section className={'pkg-include-grid'}>
						<div>
							<h2>Included</h2>
							<ul className={'pkg-check-list'}>
								{pkg.included.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						</div>
						<div>
							<h2>Exclude</h2>
							<ul className={'pkg-x-list'}>
								{pkg.excluded.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						</div>
					</section>

					<section>
						<h2>{pkg.type === 'hotels' ? 'Stay Plan' : pkg.type === 'cars' ? 'Rental Plan' : 'Tour Plan'}</h2>
						<div className={'pkg-plan'}>
							{pkg.plan.map((day, index) => (
								<div className={`pkg-plan-item ${openDay === index ? 'open' : ''}`} key={day.day}>
									<button type="button" onClick={() => setOpenDay(openDay === index ? -1 : index)}>
										<span className={'pkg-plan-day'}>{day.day}</span>
										<span className={'pkg-plan-title'}>{day.title}</span>
										<span className={'pkg-plan-chevron'} aria-hidden>
											▼
										</span>
									</button>
									{openDay === index && <p>{day.body}</p>}
								</div>
							))}
						</div>
					</section>

					<section>
						<h2>Location</h2>
						<p>{pkg.locationNote}</p>
						<div className={'pkg-map'}>
							<iframe
								title={`Map of ${pkg.location}`}
								src={`https://www.google.com/maps?q=${pkg.mapQuery}&output=embed`}
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
							/>
						</div>
					</section>

					<section className={'pkg-reviews'}>
						<h2>Customer Reviews</h2>
						<div className={'pkg-reviews-summary'}>
							<div>
								<strong>{pkg.rating.toFixed(1)}</strong>
								<span>Excellent</span>
								<em>Based on {pkg.reviewCount} reviews</em>
							</div>
							<div className={'pkg-review-bars'}>
								{reviewLabels.map((label, i) => (
									<div key={label}>
										<span>{label}</span>
										<div>
											<i style={{ width: `${88 - i * 4}%` }} />
										</div>
									</div>
								))}
							</div>
						</div>
						<article className={'pkg-review-card'}>
							<strong>Verified Velora traveler</strong>
							<p>
								Beautiful experience — booking was smooth and the package matched the description. Would
								recommend for {pkg.location}.
							</p>
						</article>
					</section>
				</div>

				<PackageBookingPanel pkg={pkg} />
			</div>
		</div>
	);
};

export default PackageDetailView;
