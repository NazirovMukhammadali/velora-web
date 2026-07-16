import { REACT_APP_API_URL } from '../config';
import type { VeloraPackage } from '../types/package';
import { enrich, type PackageSeed } from './packages';
import type { PackageExtra } from '../types/package';

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

type BackendHotel = {
	_id: string;
	hotelName: string;
	hotelLocation: string;
	hotelAddress?: string;
	hotelPrice: number;
	hotelStars?: number;
	hotelImages?: string[];
	hotelDesc?: string;
};

const clampStars = (stars?: number): number => {
	if (!stars || stars < 1) return 4;
	return Math.min(5, Math.round(stars));
};

/** Map a backend hotel to the rich VeloraPackage model (reuses enrich for generated fields). */
export const mapHotelToPackage = (hotel: BackendHotel): VeloraPackage => {
	const stars = clampStars(hotel.hotelStars);
	const city = hotel.hotelLocation?.split(',')[0]?.trim() || hotel.hotelLocation || 'Destination';
	const images = (hotel.hotelImages ?? []).map(resolvePackageImage);

	const seed: PackageSeed = {
		id: hotel._id,
		type: 'hotels',
		title: hotel.hotelName,
		location: hotel.hotelLocation,
		subtitle: `${stars}★ Hotel`,
		priceAmount: hotel.hotelPrice,
		priceUnit: '/ Night',
		rating: stars,
		reviewCount: 0,
		image: images[0] ?? FALLBACK_IMAGE,
		category: 'Stay',
		planDays: 2,
		mapCity: city,
	};

	const pkg = enrich(seed);

	return {
		...pkg,
		gallery: images.length > 0 ? images : pkg.gallery,
		about: hotel.hotelDesc?.trim() ? hotel.hotelDesc : pkg.about,
		locationNote: hotel.hotelAddress?.trim()
			? `${hotel.hotelName} is located at ${hotel.hotelAddress}. Use the map below for directions and nearby points of interest.`
			: pkg.locationNote,
	};
};

export const mapHotelsToPackages = (list?: BackendHotel[] | null): VeloraPackage[] =>
	(list ?? []).map(mapHotelToPackage);

const CAR_FALLBACK_IMAGE =
	'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=80';

const CAR_EXTRAS: PackageExtra[] = [
	{ id: 'insurance', label: 'Full coverage insurance', price: 18 },
	{ id: 'gps', label: 'GPS navigation', price: 8 },
	{ id: 'child-seat', label: 'Child seat', price: 12 },
];

type BackendRentcar = {
	_id: string;
	carTitle: string;
	carLocation: string;
	carCategory?: string;
	transmission?: string;
	seats?: number;
	dailyPrice: number;
	carImages?: string[];
	carDesc?: string;
};

/** Map a backend rentcar to the rich VeloraPackage model (reuses enrich for generated fields). */
export const mapRentcarToPackage = (rentcar: BackendRentcar): VeloraPackage => {
	const category = rentcar.carCategory?.trim() || 'Car Rental';
	const transmission = rentcar.transmission?.trim() || 'Automatic';
	const seats = rentcar.seats && rentcar.seats > 0 ? rentcar.seats : 5;
	const city = rentcar.carLocation?.split(',')[0]?.trim() || rentcar.carLocation || 'Destination';
	const images = (rentcar.carImages ?? []).map(resolvePackageImage);

	const seed: PackageSeed = {
		id: rentcar._id,
		type: 'cars',
		title: rentcar.carTitle,
		location: rentcar.carLocation,
		subtitle: `${category} · ${transmission} · ${seats} Seats`,
		priceAmount: rentcar.dailyPrice,
		priceUnit: '/ Day',
		rating: 4.7,
		reviewCount: 0,
		image: images[0] ?? CAR_FALLBACK_IMAGE,
		category,
		planDays: 1,
		mapCity: city,
	};

	const pkg = enrich(seed);

	return {
		...pkg,
		gallery: images.length > 0 ? images : [CAR_FALLBACK_IMAGE, ...pkg.gallery.slice(1)],
		about: rentcar.carDesc?.trim() ? rentcar.carDesc : pkg.about,
		experienceType: category,
		groupSize: `${seats} Seats`,
		languages: transmission,
		included: [
			'Unlimited mileage (within region)',
			'Roadside assistance 24/7',
			'Standard insurance coverage',
			'Free cancellation up to 24h before pickup',
		],
		extras: CAR_EXTRAS,
		timeSlots: ['08:00', '10:00', '12:00', '14:00', '16:00'],
	};
};

export const mapRentcarsToPackages = (list?: BackendRentcar[] | null): VeloraPackage[] =>
	(list ?? []).map(mapRentcarToPackage);
