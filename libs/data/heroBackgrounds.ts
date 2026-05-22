import type { SearchTabKey } from '../types/hero';

export const HERO_SLIDE_INTERVAL_MS = 5000;

export const HERO_BACKGROUNDS: Record<SearchTabKey, string[]> = {
	hotel: [
		'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80',
		'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',
		'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&q=80',
	],
	flights: [
		'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80',
		'https://images.unsplash.com/photo-1540962351504-030700000000?auto=format&fit=crop&w=1600&q=80',
		'https://images.unsplash.com/photo-1464037868146-7907a1ece4f3?auto=format&fit=crop&w=1600&q=80',
	],
	rentcar: [
		'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80',
		'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1600&q=80',
		'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80',
	],
};
