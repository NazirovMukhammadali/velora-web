/** Shared booking-panel helpers (hotel nights, date checks). */

const MONGO_OBJECT_ID_RE = /^[a-f\d]{24}$/i;

export const isMongoObjectId = (id: string): boolean => MONGO_OBJECT_ID_RE.test(id);

export const addOneDay = (isoDate: string): string => {
	const [year, month, day] = isoDate.split('-').map(Number);
	const date = new Date(Date.UTC(year, month - 1, day));
	date.setUTCDate(date.getUTCDate() + 1);
	return date.toISOString().slice(0, 10);
};

export const nightsBetween = (checkIn: string, checkOut: string): number => {
	const start = new Date(`${checkIn}T00:00:00Z`).getTime();
	const end = new Date(`${checkOut}T00:00:00Z`).getTime();
	return Math.max(1, Math.round((end - start) / (24 * 60 * 60 * 1000)));
};

export const hotelStayTotal = (
	pricePerNight: number,
	checkIn: string,
	checkOut: string,
	rooms: number,
): number => {
	if (!checkIn || !checkOut) return pricePerNight * Math.max(1, rooms);
	return pricePerNight * nightsBetween(checkIn, checkOut) * Math.max(1, rooms);
};

export type HotelDateValidation = { ok: true; checkOut: string } | { ok: false; message: string };

export const validateHotelStayDates = (checkIn: string, checkOut: string): HotelDateValidation => {
	if (!checkIn) return { ok: false, message: 'Please select a date.' };
	const resolvedOut = checkOut || addOneDay(checkIn);
	if (resolvedOut <= checkIn) {
		return { ok: false, message: 'Check-out must be after check-in.' };
	}
	return { ok: true, checkOut: resolvedOut };
};

export const flightBookingTotal = (basePrice: number, passengers: number): number =>
	basePrice * Math.max(1, passengers);
