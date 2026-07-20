import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import type { VeloraPackage } from '../../types/package';
import { formatPackagePrice } from '../../data/packages';
import { createBookingId, saveLocalBooking } from '../../utils/bookingsStorage';
import {
	addOneDay,
	hotelStayTotal,
	isMongoObjectId,
	validateHotelStayDates,
} from '../../utils/bookingPanel';
import useAuth from '../../hooks/useAuth';
import { CREATE_HOTEL_BOOKING } from '../../../apollo/user/mutation';
import { sweetErrorHandling, sweetMixinSuccessAlert } from '../../sweetAlert';

type PackageBookingPanelProps = {
	pkg: VeloraPackage;
};

const PackageBookingPanel = ({ pkg }: PackageBookingPanelProps) => {
	const router = useRouter();
	const { isLoggedIn } = useAuth();
	const [date, setDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [time, setTime] = useState(pkg.timeSlots[0] ?? '12:00');
	const [adults, setAdults] = useState(1);
	const [youth, setYouth] = useState(0);
	const [children, setChildren] = useState(0);
	const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
	const [submitting, setSubmitting] = useState(false);
	const [dateError, setDateError] = useState('');

	const [createHotelBooking] = useMutation(CREATE_HOTEL_BOOKING);

	const loginHref = `/login?referrer=${encodeURIComponent(router.asPath)}`;
	const isApiHotel = pkg.type === 'hotels' && isMongoObjectId(pkg.id);

	const youthPrice = pkg.youthPrice ?? Math.round(pkg.priceAmount * 0.85);
	const childPrice = pkg.childPrice ?? Math.round(pkg.priceAmount * 0.65);

	const total = useMemo(() => {
		if (isApiHotel) {
			const checkOut = endDate || (date ? addOneDay(date) : '');
			return hotelStayTotal(pkg.priceAmount, date, checkOut, adults);
		}

		let sum = adults * pkg.priceAmount + youth * youthPrice + children * childPrice;
		pkg.extras.forEach((extra) => {
			if (!selectedExtras.includes(extra.id)) return;
			if (extra.perPerson) {
				sum += extra.price * (adults + youth + children);
			} else {
				sum += extra.price;
			}
		});
		return sum;
	}, [adults, youth, children, pkg, selectedExtras, youthPrice, childPrice, isApiHotel, date, endDate]);

	const toggleExtra = (id: string) => {
		setSelectedExtras((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
	};

	const onBook = async () => {
		if (!isLoggedIn) {
			void router.push(loginHref);
			return;
		}
		if (isApiHotel) {
			const stay = validateHotelStayDates(date, endDate);
			if (!stay.ok) {
				setDateError(stay.message);
				return;
			}
			setDateError('');
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

		if (!date) {
			setDateError('Please select a date.');
			return;
		}

		setDateError('');
		setSubmitting(true);
		saveLocalBooking({
			id: createBookingId(),
			packageId: pkg.id,
			packageType: pkg.type,
			title: pkg.title,
			location: pkg.location,
			image: pkg.image,
			date,
			time,
			adults,
			youth,
			children,
			extras: selectedExtras,
			total,
			createdAt: new Date().toISOString(),
			status: 'confirmed',
		});
		setSubmitting(false);
		void router.push('/bookings?booked=1');
	};

	const bookLabel =
		pkg.type === 'tours' ? 'Book This Tour' : pkg.type === 'hotels' ? 'Book This Stay' : 'Book This Car';

	return (
		<aside className={`pkg-booking ${!isLoggedIn ? 'pkg-booking--guest' : ''}`}>
			<h3>{bookLabel}</h3>

			{!isLoggedIn && (
				<p className={'pkg-booking-login-hint'}>
					<Link href={loginHref}>Sign in</Link> or <Link href={`/register?referrer=${encodeURIComponent(router.asPath)}`}>register</Link> to
					complete your booking.
				</p>
			)}

			<label className={'pkg-booking-field'}>
				<span>{isApiHotel ? 'Check-in' : 'When (Date)'}</span>
				<input
					type="date"
					value={date}
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

			{isApiHotel ? (
				<label className={'pkg-booking-field'}>
					<span>Check-out</span>
					<input
						type="date"
						value={endDate}
						disabled={!isLoggedIn}
						min={date || undefined}
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

			<div className={'pkg-booking-tickets'}>
				<span>{isApiHotel ? 'Rooms' : 'Tickets'}</span>
				{isApiHotel ? (
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
							{Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
								<option key={n} value={n}>
									{n}
								</option>
							))}
						</select>
					</div>
				) : (
					[
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
								onChange={(e) => row.set(Number(e.target.value))}
								aria-label={row.label}
							>
								{Array.from({ length: 11 }, (_, i) => (
									<option key={i} value={i}>
										{i}
									</option>
								))}
							</select>
						</div>
					))
				)}
			</div>

			{!isApiHotel && (
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
								{extra.perPerson ? ' / person' : ''})
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
