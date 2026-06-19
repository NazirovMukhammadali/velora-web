import { REACT_APP_API_URL } from '../config';
import type { VeloraPackage } from '../types/package';
import { enrich, type PackageSeed } from './packages';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=80';

/** Backend image paths are relative to the API host; absolute URLs pass through unchanged. */
export const resolvePackageImage = (path?: string | null): string => {
	if (!path) return FALLBACK_IMAGE;
	if (/^https?:\/\//.test(path)) return path;
	return `${REACT_APP_API_URL}/${path.replace(/^\/+/, '')}`;
};

type BackendTour = {
	_id: string;
	tourTitle: string;
	tourLocation: string;
	tourDays?: number;
	tourNights?: number;
	tourPrice: number;
	tourImages?: string[];
	tourDesc?: string;
	tourSoldCount?: number;
};

/** Map a backend tour to the rich VeloraPackage model (reuses enrich for generated fields). */
export const mapTourToPackage = (tour: BackendTour): VeloraPackage => {
	const days = tour.tourDays && tour.tourDays > 0 ? tour.tourDays : 3;
	const city = tour.tourLocation?.split(',')[0]?.trim() || tour.tourLocation || 'Destination';
	const images = (tour.tourImages ?? []).map(resolvePackageImage);

	const seed: PackageSeed = {
		id: tour._id,
		type: 'tours',
		title: tour.tourTitle,
		location: tour.tourLocation,
		subtitle: `${days} ${days === 1 ? 'Day' : 'Days'}`,
		priceAmount: tour.tourPrice,
		priceUnit: '/ Person',
		rating: 4.7,
		reviewCount: tour.tourSoldCount ?? 0,
		image: images[0] ?? FALLBACK_IMAGE,
		category: 'Tour',
		planDays: days,
		mapCity: city,
	};

	const pkg = enrich(seed);

	return {
		...pkg,
		gallery: images.length > 0 ? images : pkg.gallery,
		about: tour.tourDesc?.trim() ? tour.tourDesc : pkg.about,
	};
};

export const mapToursToPackages = (list?: BackendTour[] | null): VeloraPackage[] =>
	(list ?? []).map(mapTourToPackage);
