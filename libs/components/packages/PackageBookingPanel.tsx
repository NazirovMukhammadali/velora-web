import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import type { VeloraPackage } from '../../types/package';
import { formatPackagePrice } from '../../data/packages';
import { createBookingId, saveLocalBooking } from '../../utils/bookingsStorage';
import {
	addOneDay,
	carRentalTotal,
	hotelStayTotal,
	isMongoObjectId,
	isPastIsoDate,
	rentalDays,
	validateHotelStayDates,
	validateRentalDates,
} from '../../utils/bookingPanel';
import { readTripParams } from '../../utils/heroSearch';
import useAuth from '../../hooks/useAuth';
import useTodayIso from '../../hooks/useTodayIso';
import { CREATE_HOTEL_BOOKING, CREATE_TOUR_BOOKING } from '../../../apollo/user/mutation';
import { sweetErrorHandling, sweetMixinSuccessAlert } from '../../sweetAlert';

type PackageBookingPanelProps = {
	pkg: VeloraPackage;
};

const MAX_ROOMS = 10;
const MAX_TICKETS = 10;

const PackageBookingPanel = ({ pkg }: PackageBookingPanelProps) => {
	const router = useRouter();
	const { isLoggedIn } = useAuth();
	const minDate = useTodayIso();
	const [date, setDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [time, setTime] = useState(pkg.timeSlots[0] ?? '12:00');
	const [adults, setAdults] = useState(1);
	const [youth, setYouth] = useState(0);
	const [children, setChildren] = useState(0);
	const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
	const [submitting, setSubmitting] = useState(false);
	const [dateError, setDateError] = useState('');
	const [ticketError, setTicketError] = useState('');

	const [createHotelBooking] = useMutation(CREATE_HOTEL_BOOKING);
	const [createTourBooking] = useMutation(CREATE_TOUR_BOOKING);

	const loginHref = `/login?referrer=${encodeURIComponent(router.asPath)}`;
	const isStay = pkg.type === 'hotels';
	const isCar = pkg.type === 'cars';
	const isTour = pkg.type === 'tours';
	const isApiItem = isMongoObjectId(pkg.id);

	const youthPrice = pkg.youthPrice ?? Math.round(pkg.priceAmount * 0.85);
	const childPrice = pkg.childPrice ?? Math.round(pkg.priceAmount * 0.65);

	// Reset selections when navigating client-side between packages.
	const firstSlot = pkg.timeSlots[0] ?? '12:00';
	useEffect(() => {
		setTime(firstSlot);
		setSelectedExtras([]);
		setDateError('');
		setTicketError('');
	}, [pkg.id, firstSlot]);

	// Prefill dates / party size from hero or catalog search params.
	useEffect(() => {
		if (!router.isReady) return;
		const trip = readTripParams(router.query);
		if (trip.startDate && !isPastIsoDate(trip.startDate)) {
			setDate(trip.startDate);
			if (trip.endDate) setEndDate(trip.endDate);
		}
		if (trip.party && !isCar) {
			const party = Number(trip.party);
			setAdults(Math.min(isStay ? MAX_ROOMS : MAX_TICKETS, Math.max(1, party)));
		}
	}, [router.isReady, router.query, isCar, isStay]);

	const travellers = adults + youth + children;

	const extrasTotal = useMemo(() => {
		let sum = 0;
		pkg.extras.forEach((extra) => {
			if (!selectedExtras.includes(extra.id)) return;
			sum += extra.perPerson && isTour ? extra.price * travellers : extra.price;
		});
		return sum;
	}, [pkg.extras, selectedExtras, isTour, travellers]);

	const total = useMemo(() => {
		if (isStay) {
			const checkOut = endDate || (date ? addOneDay(date) : '');
			return hotelStayTotal(pkg.priceAmount, date, checkOut, adults);
		}
		if (isCar) {
			const dropOff = endDate || date;
			return carRentalTotal(pkg.priceAmount, date, dropOff) + extrasTotal;
		}
		return adults * pkg.priceAmount + youth * youthPrice + children * childPrice + extrasTotal;
	}, [isStay, isCar, endDate, date, pkg.priceAmount, adults, youth, children, youthPrice, childPrice, extrasTotal]);

	const toggleExtra = (id: string) => {
		setSelectedExtras((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
	};

	const finishLocalBooking = (bookingEndDate?: string) => {
		saveLocalBooking({
			id: createBookingId(),
			packageId: pkg.id,
			packageType: pkg.type,
			title: pkg.title,
			location: pkg.location,
			image: pkg.image,
			date,
			endDate: bookingEndDate,
			time: isTour ? time : '',
			adults: isCar ? 1 : adults,
			youth: isTour ? youth : 0,
			children: isTour ? children : 0,
			extras: isStay ? [] : selectedExtras,
			total,
			createdAt: new Date().toISOString(),
			status: 'confirmed',
		});
		void router.push('/bookings?booked=1');
	};

	const onBook = async () => {
		if (!isLoggedIn) {
			void router.push(loginHref);
			return;
		}

		if (isStay) {
			const stay = validateHotelStayDates(date, endDate);
			if (!stay.ok) {
				setDateError(stay.message);
				return;
			}
			setDateError('');
			if (!isApiItem) {
				finishLocalBooking(stay.checkOut);
				return;
			}
			setSubmitting(true);
			try {
				await createHotelBooking({
					variables: {
						input: {
							hotelId: pkg.id,
							checkInDate: date,
							checkOutDate: stay.checkOut,
							quantity: Math.max(1, adults),
						},
					},
				});
				await sweetMixinSuccessAlert('Stay request sent. Waiting for admin confirmation.');
				void router.push('/bookings?booked=1&type=hotel');
			} catch (err) {
				await sweetErrorHandling(err);
			} finally {
				setSubmitting(false);
			}
			return;
		}

		if (isCar) {
			const rental = validateRentalDates(date, endDate);
			if (!rental.ok) {
				setDateError(rental.message);
				return;
			}
			setDateError('');
			finishLocalBooking(rental.dropOff);
			return;
		}

		if (!date) {
			setDateError('Please select a date.');
			return;
		}
		if (isPastIsoDate(date)) {
			setDateError('Date cannot be in the past.');
			return;
		}
		setDateError('');
		if (travellers < 1) {
			setTicketError('Select at least one ticket.');
			return;
		}
		setTicketError('');

		if (!isApiItem) {
			finishLocalBooking();
			return;
		}

		setSubmitting(true);
		try {
			await createTourBooking({ variables: { input: { tourId: pkg.id } } });
			await sweetMixinSuccessAlert('Tour booking sent to the agent.');
			void router.push('/bookings?booked=1');
		} catch (err) {
			await sweetErrorHandling(err);
		} finally {
			setSubmitting(false);
		}
	};

	const bookLabel = isTour ? 'Book This Tour' : isStay ? 'Book This Stay' : 'Book This Car';
	const startLabel = isStay ? 'Check-in' : isCar ? 'Pick-up date' : 'When (Date)';
	const rentalDayCount = isCar && date ? rentalDays(date, endDate || date) : 1;

	return (
		<aside className={`pkg-booking ${!isLoggedIn ? 'pkg-booking--guest' : ''}`}>
			<h3>{bookLabel}</h3>

			{!isLoggedIn && (
				<p className={'pkg-booking-login-hint'}>
					<Link href={loginHref}>Sign in</Link> or{' '}
					<Link href={`/register?referrer=${encodeURIComponent(router.asPath)}`}>register</Link> to complete your
					booking.
				</p>
			)}

			<label className={'pkg-booking-field'}>
				<span>{startLabel}</span>
				<input
					type="date"
					value={date}
					min={minDate}
					disabled={!isLoggedIn}
					onChange={(e) => {
						setDate(e.target.value);
						if (e.target.value) setDateError('');
					}}
					aria-invalid={Boolean(dateError)}
					aria-describedby={dateError ? 'pkg-date-error' : undefined}
				/>
				{dateError && (
					<span id="pkg-date-error" className="pkg-booking-field-error" role="alert">
						{dateError}
					</span>
				)}
			</label>

			{isStay || isCar ? (
				<label className={'pkg-booking-field'}>
					<span>{isStay ? 'Check-out' : 'Drop-off date'}</span>
					<input
						type="date"
						value={endDate}
						disabled={!isLoggedIn}
						min={date || minDate}
						onChange={(e) => setEndDate(e.target.value)}
					/>
				</label>
			) : (
				<div className={'pkg-booking-times'}>
					<span>Time</span>
					<div>
						{pkg.timeSlots.map((slot) => (
							<label key={slot}>
								<input
									type="radio"
									name="pkg-time"
									checked={time === slot}
									disabled={!isLoggedIn}
									onChange={() => setTime(slot)}
								/>
								{slot}
							</label>
						))}
					</div>
				</div>
			)}

			{isCar && (
				<div className={'pkg-booking-tickets'}>
					<span>Rental</span>
					<div className={'pkg-ticket-row'}>
						<div>
							<strong>
								{rentalDayCount} day{rentalDayCount !== 1 ? 's' : ''}
							</strong>
							<em>{formatPackagePrice(pkg.priceAmount)} / day</em>
						</div>
					</div>
				</div>
			)}

			{isStay && (
				<div className={'pkg-booking-tickets'}>
					<span>Rooms</span>
					<div className={'pkg-ticket-row'}>
						<div>
							<strong>Rooms</strong>
							<em>{formatPackagePrice(pkg.priceAmount)} / night</em>
						</div>
						<select
							value={adults}
							disabled={!isLoggedIn}
							onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))}
							aria-label="Rooms"
						>
							{Array.from({ length: MAX_ROOMS }, (_, i) => i + 1).map((n) => (
								<option key={n} value={n}>
									{n}
								</option>
							))}
						</select>
					</div>
				</div>
			)}

			{isTour && (
				<div className={'pkg-booking-tickets'}>
					<span>Tickets</span>
					{[
						{ key: 'adults', label: 'Adult (14+ years)', price: pkg.priceAmount, value: adults, set: setAdults },
						{ key: 'youth', label: 'Youth (13–17 years)', price: youthPrice, value: youth, set: setYouth },
						{ key: 'children', label: 'Children (3–12 years)', price: childPrice, value: children, set: setChildren },
					].map((row) => (
						<div className={'pkg-ticket-row'} key={row.key}>
							<div>
								<strong>{row.label}</strong>
								<em>{formatPackagePrice(row.price)}</em>
							</div>
							<select
								value={row.value}
								disabled={!isLoggedIn}
								onChange={(e) => {
									row.set(Number(e.target.value));
									setTicketError('');
								}}
								aria-label={row.label}
							>
								{Array.from({ length: MAX_TICKETS + 1 }, (_, i) => (
									<option key={i} value={i}>
										{i}
									</option>
								))}
							</select>
						</div>
					))}
					{ticketError && (
						<span className="pkg-booking-field-error" role="alert">
							{ticketError}
						</span>
					)}
				</div>
			)}

			{!isStay && pkg.extras.length > 0 && (
				<div className={'pkg-booking-extras'}>
					<span>Add Extra</span>
					{pkg.extras.map((extra) => (
						<label key={extra.id} className={'pkg-extra-row'}>
							<input
								type="checkbox"
								checked={selectedExtras.includes(extra.id)}
								disabled={!isLoggedIn}
								onChange={() => toggleExtra(extra.id)}
							/>
							<span>
								{extra.label} ({formatPackagePrice(extra.price)}
								{extra.perPerson && isTour ? ' / person' : ''})
							</span>
						</label>
					))}
				</div>
			)}

			<div className={'pkg-booking-total'}>
				<span>Total Cost:</span>
				<strong>{formatPackagePrice(total)}</strong>
			</div>

			{isLoggedIn ? (
				<button type="button" className={'pkg-booking-submit'} disabled={submitting} onClick={() => void onBook()}>
					{submitting ? 'Booking…' : 'BOOK NOW'}
				</button>
			) : (
				<Link href={loginHref} className={'pkg-booking-submit pkg-booking-submit--login'}>
					SIGN IN TO BOOK
				</Link>
			)}
		</aside>
	);
};

export default PackageBookingPanel;
