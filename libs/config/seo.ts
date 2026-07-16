export const SITE_NAME = 'Velora';

export const DEFAULT_SEO = {
	title: 'Velora — Smart Travel Booking',
	description:
		'Compare flights, hotels, rental cars, and curated tours in one place. Search, filter, and book travel with verified agents on Velora.',
};

export type RouteSeo = {
	title: string;
	description: string;
};

/** Static SEO copy for layout-driven routes (English, portfolio / search engines). */
export const ROUTE_SEO: Record<string, RouteSeo> = {
	'/': {
		title: 'Velora — Smart Travel Booking',
		description:
			'Search flights, hotels, rental cars, and tour packages. Immersive hero search, shareable filters, and booking — all in one travel platform.',
	},
	'/tours': {
		title: 'Tour Packages',
		description:
			'Browse curated tour packages worldwide. Filter by destination, category, and price — then open full itineraries, reviews, and booking.',
	},
	'/hotels': {
		title: 'Hotels & Stays',
		description:
			'Find boutique riads, city classics, and unique stays. Compare verified hotels with clear nightly pricing and instant detail pages.',
	},
	'/rentcar': {
		title: 'Car Rentals',
		description:
			'Rent compact city cars, family SUVs, and premium rides. Filter by location, vehicle type, and daily rate on Velora.',
	},
	'/flights': {
		title: 'Flights',
		description:
			'Search and compare flight fares across airlines. Filter routes, sort by price or duration, and book with transparent pricing.',
	},
	'/package/detail': {
		title: 'Package Details',
		description:
			'Full itinerary, photo gallery, reviews, and booking for tours, hotels, and rental cars on Velora.',
	},
	'/flights/detail': {
		title: 'Flight Details',
		description:
			'Schedule, fare breakdown, baggage rules, and passenger booking for your selected flight on Velora.',
	},
	'/agent': {
		title: 'Travel Agents',
		description: 'Meet certified travel experts. Compare ratings, tour counts, and connect with agents you trust.',
	},
	'/bookings': {
		title: 'My Bookings',
		description: 'Track your tour, hotel, car, and flight booking statuses in one dashboard.',
	},
	'/about': {
		title: 'About Velora',
		description: 'Learn how Velora helps travelers compare and book smarter across flights, stays, and tours.',
	},
};

export const getRouteSeo = (pathname: string): RouteSeo => ROUTE_SEO[pathname] ?? DEFAULT_SEO;
