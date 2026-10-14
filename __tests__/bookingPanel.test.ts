import {
	addOneDay,
	flightBookingTotal,
	hotelStayTotal,
	isMongoObjectId,
	nightsBetween,
	validateHotelStayDates,
	carRentalTotal,
	isPastIsoDate,
	rentalDays,
	todayIso,
	validateRentalDates,
} from '../libs/utils/bookingPanel';

const TODAY = '2026-08-01';

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
		expect(validateHotelStayDates('2026-08-02', '2026-08-01', TODAY).ok).toBe(false);
		expect(validateHotelStayDates('2026-08-01', '', TODAY)).toEqual({
			ok: true,
			checkOut: '2026-08-02',
		});
		expect(validateHotelStayDates('2026-07-01', '', TODAY)).toEqual({
			ok: false,
			message: 'Check-in date cannot be in the past.',
		});
	});

	it('prices car rentals per day, not per traveller', () => {
		expect(rentalDays('2026-08-01', '2026-08-04')).toBe(3);
		expect(rentalDays('2026-08-01', '2026-08-01')).toBe(1);
		expect(carRentalTotal(80, '2026-08-01', '2026-08-04')).toBe(240);
	});

	it('validates rental dates', () => {
		expect(validateRentalDates('', '', TODAY).ok).toBe(false);
		expect(validateRentalDates('2026-07-01', '', TODAY).ok).toBe(false);
		expect(validateRentalDates('2026-08-03', '2026-08-01', TODAY).ok).toBe(false);
		expect(validateRentalDates('2026-08-01', '', TODAY)).toEqual({ ok: true, dropOff: '2026-08-02' });
	});

	it('formats today and detects past dates', () => {
		expect(todayIso(new Date(2026, 0, 5))).toBe('2026-01-05');
		expect(isPastIsoDate('2026-07-31', TODAY)).toBe(true);
		expect(isPastIsoDate('2026-08-01', TODAY)).toBe(false);
		expect(isPastIsoDate('', TODAY)).toBe(false);
	});

	it('computes flight totals', () => {
		expect(flightBookingTotal(150, 3)).toBe(450);
	});
});
