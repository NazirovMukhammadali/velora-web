import { createBookingId, getLocalBookings, saveLocalBooking } from '../libs/utils/bookingsStorage';
import type { StoredBooking } from '../libs/types/package';

const memory = new Map<string, string>();

beforeAll(() => {
	Object.defineProperty(globalThis, 'window', {
		value: {
			localStorage: {
				getItem: (k: string) => memory.get(k) ?? null,
				setItem: (k: string, v: string) => {
					memory.set(k, v);
				},
				clear: () => memory.clear(),
			},
		},
		configurable: true,
	});
});

const sample = (): StoredBooking => ({
	id: 'vb_test',
	packageId: 'pkg1',
	packageType: 'hotels',
	title: 'Test Hotel',
	location: 'Seoul',
	image: '/img.jpg',
	date: '2026-08-01',
	time: '15:00',
	adults: 2,
	youth: 0,
	children: 0,
	extras: [],
	total: 200,
	createdAt: '2026-07-01T00:00:00.000Z',
	status: 'confirmed',
});

describe('bookingsStorage', () => {
	beforeEach(() => {
		memory.clear();
	});

	it('creates unique booking ids', () => {
		expect(createBookingId()).toMatch(/^vb_\d+_[a-z0-9]+$/);
		expect(createBookingId()).not.toBe(createBookingId());
	});

	it('saves and reads local bookings', () => {
		saveLocalBooking(sample());
		const list = getLocalBookings();
		expect(list).toHaveLength(1);
		expect(list[0].title).toBe('Test Hotel');
	});

	it('returns empty list for corrupt storage', () => {
		memory.set('velora_local_bookings', '{not-json');
		expect(getLocalBookings()).toEqual([]);
	});
});
