import type { StoredBooking } from '../types/package';

const STORAGE_KEY = 'velora_local_bookings';

export const getLocalBookings = (): StoredBooking[] => {
	if (typeof window === 'undefined') return [];
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw) as StoredBooking[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

export const saveLocalBooking = (booking: StoredBooking): void => {
	const list = getLocalBookings();
	list.unshift(booking);
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
};

export const createBookingId = (): string =>
	`vb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
