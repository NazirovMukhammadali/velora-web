export type PackageType = 'tours' | 'hotels' | 'cars';

export type PackageBadge = 'New' | 'Offer' | 'Featured';

export type PackagePlanDay = {
	day: string;
	title: string;
	body: string;
};

export type PackageExtra = {
	id: string;
	label: string;
	price: number;
	perPerson?: boolean;
};

export type VeloraPackage = {
	id: string;
	type: PackageType;
	title: string;
	location: string;
	subtitle: string;
	priceAmount: number;
	oldPriceAmount?: number;
	priceUnit: string;
	rating: number;
	reviewCount: number;
	image: string;
	badge?: PackageBadge;
	category?: string;
	gallery: string[];
	about: string;
	highlights: string[];
	included: string[];
	excluded: string[];
	plan: PackagePlanDay[];
	locationNote: string;
	mapQuery: string;
	durationLabel: string;
	experienceType: string;
	groupSize: string;
	languages: string;
	extras: PackageExtra[];
	timeSlots: string[];
	youthPrice?: number;
	childPrice?: number;
};

export type StoredBooking = {
	id: string;
	packageId: string;
	packageType: PackageType;
	title: string;
	location: string;
	image: string;
	date: string;
	time: string;
	adults: number;
	youth: number;
	children: number;
	extras: string[];
	total: number;
	createdAt: string;
	status: 'confirmed';
};
