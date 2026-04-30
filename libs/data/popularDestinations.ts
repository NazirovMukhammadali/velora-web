export type PopularDestination = {
	slug: string;
	name: string;
	tourCount: number;
	image: string;
};

/** Homepage “Popular destinations” grid — brochure counts are illustrative. */
export const POPULAR_DESTINATIONS: PopularDestination[] = [
	{
		slug: 'paris',
		name: 'Paris',
		tourCount: 5,
		image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80',
	},
	{
		slug: 'sydney',
		name: 'Sydney',
		tourCount: 8,
		image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80',
	},
	{
		slug: 'new-york',
		name: 'New York',
		tourCount: 6,
		image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=900&q=80',
	},
	{
		slug: 'barcelona',
		name: 'Barcelona',
		tourCount: 7,
		image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=900&q=80',
	},
];
