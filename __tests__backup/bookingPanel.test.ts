import {
	addOneDay,
	flightBookingTotal,
	hotelStayTotal,
	isMongoObjectId,
	nightsBetween,
	validateHotelStayDates,
} from '../libs/utils/bookingPanel';

describe('bookingPanel helpers', () => {
	it('detects Mongo ObjectIds used for API hotels', () => {
		expect(isMongoObjectId('507f1f77bcf86cd799439011')).toBe(true);
		expect(isMongoObjectId('static-hotel-1')).toBe(false);
	});

	it('adds one UTC day for default check-out', () => {
		expect(addOneDay('2026-08-01')).toBe('2026-08-02');
	});

	it('counts nights and totals hotel stays', () => {
		expect(nightsBetween('2026-08-01', '2026-08-04')).toBe(3);
		expect(hotelStayTotal(100, '2026-08-01', '2026-08-03', 2)).toBe(400);
	});

	it('validates hotel stay dates', () => {
		expect(validateHotelStayDates('', '')).toEqual({
			ok: false,
			message: 'Please select a date.',
		});
		expect(validateHotelStayDates('2026-08-02', '2026-08-01').ok).toBe(false);
		expect(validateHotelStayDates('2026-08-01', '')).toEqual({
			ok: true,
			checkOut: '2026-08-02',
		});
	});

	it('computes flight totals', () => {
		expect(flightBookingTotal(150, 3)).toBe(450);
	});
});
