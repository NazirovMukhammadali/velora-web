import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { VeloraPackage } from '../../types/package';
import { formatPackagePrice, getPackageReviewsLabel, packageDetailHref } from '../../data/packages';
import { isPackageFavorite, togglePackageFavorite } from '../../utils/favoritesStorage';

const PinIcon = () => (
	<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
		<path
			d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z"
			fill="currentColor"
		/>
	</svg>
);

const ClockIcon = () => (
	<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
		<path
			d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 10.59 3.3 3.3-1.42 1.42L11 13.41V7h2z"
			fill="currentColor"
		/>
	</svg>
);

const StarIcon = () => (
	<svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
		<path
			d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
			fill="currentColor"
		/>
	</svg>
);

type PackageCardProps = {
	pkg: VeloraPackage;
};

const PackageCard = ({ pkg }: PackageCardProps) => {
	const href = packageDetailHref(pkg.type, pkg.id);
	const reviewsLabel = getPackageReviewsLabel(pkg.reviewCount);
	const [liked, setLiked] = useState(false);

	useEffect(() => {
		setLiked(isPackageFavorite(pkg.type, pkg.id));
	}, [pkg.type, pkg.id]);

	const onLikeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setLiked(togglePackageFavorite(pkg.type, pkg.id));
	};

	return (
		<article className={'tour-card'}>
			<div className={'tour-image'}>
				<Link href={href} className={'tour-image-link'} tabIndex={-1} aria-hidden>
					<img src={pkg.image} alt={pkg.title} />
				</Link>
				{pkg.badge && (
					<span className={`tour-badge tour-badge--${pkg.badge.toLowerCase()}`}>
						{pkg.badge === 'Featured' && <StarIcon />}
						{pkg.badge === 'Offer' ? '% Offer' : pkg.badge}
					</span>
				)}
				<button
					type="button"
					className={`tour-like ${liked ? 'is-liked' : ''}`}
					aria-label={liked ? `Remove ${pkg.title} from favorites` : `Save ${pkg.title} to favorites`}
					aria-pressed={liked}
					onClick={onLikeClick}
				>
					{liked ? '♥' : '♡'}
				</button>
			</div>
			<Link href={href} className={'tour-card-body'}>
				<div className={'tour-info'}>
					<h3 title={pkg.title}>{pkg.title}</h3>
					<p className={'tour-meta'}>
						<PinIcon />
						{pkg.location}
					</p>
					<p className={'tour-meta'}>
						<ClockIcon />
						{pkg.subtitle}
					</p>
				</div>
				<div className={'tour-bottom'}>
					<div className={'tour-price'}>
						{pkg.oldPriceAmount && <del>{formatPackagePrice(pkg.oldPriceAmount)}</del>}
						<strong>
							{formatPackagePrice(pkg.priceAmount)} <span>{pkg.priceUnit}</span>
						</strong>
					</div>
					<em className={'tour-reviews'}>
						<StarIcon /> ({reviewsLabel})
					</em>
				</div>
			</Link>
		</article>
	);
};

export default PackageCard;
