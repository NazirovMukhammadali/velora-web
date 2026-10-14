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

export const hotelStayTotal = (pricePerNight: number, checkIn: string, checkOut: string, rooms: number): number => {
	if (!checkIn || !checkOut) return pricePerNight * Math.max(1, rooms);
	return pricePerNight * nightsBetween(checkIn, checkOut) * Math.max(1, rooms);
};

export type HotelDateValidation = { ok: true; checkOut: string } | { ok: false; message: string };

export const validateHotelStayDates = (
	checkIn: string,
	checkOut: string,
	today: string = todayIso(),
): HotelDateValidation => {
	if (!checkIn) return { ok: false, message: 'Please select a date.' };
	if (isPastIsoDate(checkIn, today)) return { ok: false, message: 'Check-in date cannot be in the past.' };
	const resolvedOut = checkOut || addOneDay(checkIn);
	if (resolvedOut <= checkIn) {
		return { ok: false, message: 'Check-out must be after check-in.' };
	}
	return { ok: true, checkOut: resolvedOut };
};

export const flightBookingTotal = (basePrice: number, passengers: number): number =>
	basePrice * Math.max(1, passengers);

/** Today's date in the user's local timezone as YYYY-MM-DD (for `min` on date inputs). */
export const todayIso = (now: Date = new Date()): string => {
	const y = now.getFullYear();
	const m = String(now.getMonth() + 1).padStart(2, '0');
	const d = String(now.getDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
};

export const isPastIsoDate = (isoDate: string, today: string = todayIso()): boolean =>
	Boolean(isoDate) && isoDate < today;

/** Rental days between pick-up and drop-off (same-day return counts as one day). */
export const rentalDays = (pickUp: string, dropOff: string): number => {
	if (!pickUp || !dropOff) return 1;
	return nightsBetween(pickUp, dropOff);
};

export const carRentalTotal = (pricePerDay: number, pickUp: string, dropOff: string): number =>
	pricePerDay * rentalDays(pickUp, dropOff);

export type RentalDateValidation = { ok: true; dropOff: string } | { ok: false; message: string };

export const validateRentalDates = (
	pickUp: string,
	dropOff: string,
	today: string = todayIso(),
): RentalDateValidation => {
	if (!pickUp) return { ok: false, message: 'Please select a pick-up date.' };
	if (isPastIsoDate(pickUp, today)) return { ok: false, message: 'Pick-up date cannot be in the past.' };
	const resolved = dropOff || addOneDay(pickUp);
	if (resolved < pickUp) return { ok: false, message: 'Drop-off must be on or after pick-up.' };
	return { ok: true, dropOff: resolved };
};
