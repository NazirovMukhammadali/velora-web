import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import type { Flight } from '../../data/flights';
import { formatPackagePrice } from '../../data/packages';
import { createBookingId, saveLocalBooking } from '../../utils/bookingsStorage';
import useAuth from '../../hooks/useAuth';

const FLIGHT_IMAGE = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80';

type FlightBookingPanelProps = {
	flight: Flight;
};

const FlightBookingPanel = ({ flight }: FlightBookingPanelProps) => {
	const router = useRouter();
	const { isLoggedIn } = useAuth();
	const [date, setDate] = useState('');
	const [passengers, setPassengers] = useState(1);
	const [submitting, setSubmitting] = useState(false);
	const [dateError, setDateError] = useState('');

	const loginHref = `/login?referrer=${encodeURIComponent(router.asPath)}`;

	const total = useMemo(() => flight.basePrice * passengers, [flight.basePrice, passengers]);

	const onBook = () => {
		if (!isLoggedIn) {
			void router.push(loginHref);
			return;
		}
		if (!date) {
			setDateError('Please select a departure date.');
			return;
		}
		setDateError('');
		setSubmitting(true);
		saveLocalBooking({
			id: createBookingId(),
			packageId: flight.id,
			packageType: 'flights',
			title: `${flight.airline} · ${flight.flightNumber}`,
			location: `${flight.fromAirport} → ${flight.toAirport}`,
			image: FLIGHT_IMAGE,
			date,
			time: flight.departureTime ?? '',
			adults: passengers,
			youth: 0,
			children: 0,
			extras: [],
			total,
			createdAt: new Date().toISOString(),
			status: 'confirmed',
		});
		setSubmitting(false);
		void router.push('/bookings?booked=1');
	};

	return (
		<aside className={`pkg-booking ${!isLoggedIn ? 'pkg-booking--guest' : ''}`}>
			<h3>Book this flight</h3>

			{!isLoggedIn && (
				<p className={'pkg-booking-login-hint'}>
					<Link href={loginHref}>Sign in</Link> or{' '}
					<Link href={`/register?referrer=${encodeURIComponent(router.asPath)}`}>register</Link> to complete your
					booking.
				</p>
			)}

			<div className={'flight-book-summary'}>
				<div>
					<strong>{flight.departureTime ?? '--:--'}</strong>
					<span>{flight.fromAirport}</span>
				</div>
				<em>{flight.durationLabel ?? ''}</em>
				<div>
					<strong>{flight.arrivalTime ?? '--:--'}</strong>
					<span>{flight.toAirport}</span>
				</div>
			</div>

			<label className={'pkg-booking-field'}>
				<span>Departure date</span>
				<input
					type="date"
					value={date}
					disabled={!isLoggedIn}
					onChange={(e) => {
						setDate(e.target.value);
						if (e.target.value) setDateError('');
					}}
					aria-invalid={Boolean(dateError)}
					aria-describedby={dateError ? 'flight-date-error' : undefined}
				/>
				{dateError && (
					<span id="flight-date-error" className="pkg-booking-field-error" role="alert">
						{dateError}
					</span>
				)}
			</label>

			<div className={'pkg-booking-tickets'}>
				<span>Passengers</span>
				<div className={'pkg-ticket-row'}>
					<div>
						<strong>{flight.cabinClass}</strong>
						<em>{formatPackagePrice(flight.basePrice)} / passenger</em>
					</div>
					<select
						value={passengers}
						disabled={!isLoggedIn}
						onChange={(e) => setPassengers(Number(e.target.value))}
						aria-label="Passengers"
					>
						{Array.from({ length: 9 }, (_, i) => (
							<option key={i + 1} value={i + 1}>
								{i + 1}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className={'pkg-booking-total'}>
				<span>Total Cost:</span>
				<strong>{formatPackagePrice(total)}</strong>
			</div>

			{isLoggedIn ? (
				<button type="button" className={'pkg-booking-submit'} disabled={submitting} onClick={onBook}>
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

export default FlightBookingPanel;
