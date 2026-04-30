export type TourCategory =
	| 'Adventure'
	| 'City'
	| 'Beach'
	| 'Culture'
	| 'Mountain'
	| 'Nature';

export type Tour = {
	id: string;
	title: string;
	location: string;
	country: string;
	durationDays: number;
	pricePerPerson: number;
	rating: number;
	reviews: number;
	image: string;
	category: TourCategory;
	badge?: 'New' | 'Featured' | 'Offer';
};

export const TOURS: Tour[] = [
	{
		id: 'venice-canals',
		title: 'Romantic Gondolas And Hidden Canals',
		location: 'Venice',
		country: 'Italy',
		durationDays: 7,
		pricePerPerson: 320,
		rating: 4.9,
		reviews: 128,
		image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=900&q=80',
		category: 'Culture',
		badge: 'New',
	},
	{
		id: 'dubai-eternal',
		title: 'When You Visit The Eternal Dubai City',
		location: 'Dubai',
		country: 'Emirates',
		durationDays: 2,
		pricePerPerson: 149,
		rating: 4.7,
		reviews: 96,
		image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80',
		category: 'City',
		badge: 'Offer',
	},
	{
		id: 'phuket-phi-phi',
		title: 'Phi Phi Islands Speedboat Adventure',
		location: 'Phuket',
		country: 'Thailand',
		durationDays: 5,
		pricePerPerson: 349,
		rating: 4.8,
		reviews: 142,
		image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=900&q=80',
		category: 'Beach',
		badge: 'New',
	},
	{
		id: 'new-york-skyline',
		title: 'Manhattan Skyline And Liberty Cruise',
		location: 'New York',
		country: 'USA',
		durationDays: 3,
		pricePerPerson: 255,
		rating: 4.6,
		reviews: 88,
		image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=900&q=80',
		category: 'City',
		badge: 'Featured',
	},
	{
		id: 'swiss-alps-train',
		title: 'Swiss Alps Panorama Train Journey',
		location: 'Zermatt',
		country: 'Switzerland',
		durationDays: 6,
		pricePerPerson: 289,
		rating: 4.9,
		reviews: 175,
		image: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=900&q=80',
		category: 'Mountain',
	},
	{
		id: 'norway-aurora',
		title: 'Northern Fjords And Aurora Lights',
		location: 'Bergen',
		country: 'Norway',
		durationDays: 4,
		pricePerPerson: 199,
		rating: 4.8,
		reviews: 110,
		image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=80',
		category: 'Nature',
		badge: 'Featured',
	},
	{
		id: 'rome-vatican',
		title: 'Vatican Museums And Sistine Chapel Tour',
		location: 'Rome',
		country: 'Italy',
		durationDays: 1,
		pricePerPerson: 119,
		rating: 4.7,
		reviews: 64,
		image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80',
		category: 'Culture',
	},
	{
		id: 'sydney-harbour',
		title: 'Sydney Harbour And Opera House Sail',
		location: 'Sydney',
		country: 'Australia',
		durationDays: 3,
		pricePerPerson: 255,
		rating: 4.8,
		reviews: 92,
		image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=900&q=80',
		category: 'City',
	},
	{
		id: 'bali-cultural',
		title: 'Bali Temple Sunrise And Ubud Forest',
		location: 'Bali',
		country: 'Indonesia',
		durationDays: 5,
		pricePerPerson: 219,
		rating: 4.9,
		reviews: 153,
		image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=900&q=80',
		category: 'Culture',
		badge: 'New',
	},
	{
		id: 'morocco-marrakech',
		title: 'Marrakech Souks And Atlas Mountain Tour',
		location: 'Marrakech',
		country: 'Morocco',
		durationDays: 6,
		pricePerPerson: 268,
		rating: 4.6,
		reviews: 71,
		image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=900&q=80',
		category: 'Adventure',
	},
	{
		id: 'tokyo-neon',
		title: 'Tokyo Neon Nights And Shibuya Walk',
		location: 'Tokyo',
		country: 'Japan',
		durationDays: 4,
		pricePerPerson: 295,
		rating: 4.8,
		reviews: 138,
		image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80',
		category: 'City',
		badge: 'Featured',
	},
	{
		id: 'finland-igloo',
		title: 'Lapland Glass Igloo And Aurora Hunt',
		location: 'Rovaniemi',
		country: 'Finland',
		durationDays: 3,
		pricePerPerson: 245,
		rating: 4.9,
		reviews: 84,
		image: 'https://images.unsplash.com/photo-1551867633-194f125bddfa?auto=format&fit=crop&w=900&q=80',
		category: 'Nature',
		badge: 'New',
	},
];

export const TOUR_CATEGORIES: TourCategory[] = [
	'Adventure',
	'City',
	'Beach',
	'Culture',
	'Mountain',
	'Nature',
];
