import type { PackageType } from '../types/package';

const STORAGE_KEY = 'velora_favorites';

export const favoriteKey = (type: PackageType, id: string): string => `${type}:${id}`;

export const getFavoriteKeys = (): string[] => {
	if (typeof window === 'undefined') return [];
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw) as string[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

export const isPackageFavorite = (type: PackageType, id: string): boolean =>
	getFavoriteKeys().includes(favoriteKey(type, id));

/** Toggles favorite; returns new liked state. */
export const togglePackageFavorite = (type: PackageType, id: string): boolean => {
	const key = favoriteKey(type, id);
	const set = new Set(getFavoriteKeys());
	const next = !set.has(key);
	if (next) {
		set.add(key);
	} else {
		set.delete(key);
	}
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
	return next;
};
