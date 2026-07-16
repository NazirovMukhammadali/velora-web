import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import type { VeloraPackage } from '../../types/package';
import { formatPackagePrice } from '../../data/packages';
import { createBookingId, saveLocalBooking } from '../../utils/bookingsStorage';
import useAuth from '../../hooks/useAuth';

type PackageBookingPanelProps = {
	pkg: VeloraPackage;
};

const PackageBookingPanel = ({ pkg }: PackageBookingPanelProps) => {
	const router = useRouter();
	const { isLoggedIn } = useAuth();
	const [date, setDate] = useState('');
	const [time, setTime] = useState(pkg.timeSlots[0] ?? '12:00');
	const [adults, setAdults] = useState(1);
	const [youth, setYouth] = useState(0);
	const [children, setChildren] = useState(0);
	const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
	const [submitting, setSubmitting] = useState(false);
	const [dateError, setDateError] = useState('');

	const loginHref = `/login?referrer=${encodeURIComponent(router.asPath)}`;

	const youthPrice = pkg.youthPrice ?? Math.round(pkg.priceAmount * 0.85);
	const childPrice = pkg.childPrice ?? Math.round(pkg.priceAmount * 0.65);

	const total = useMemo(() => {
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
	}, [adults, youth, children, pkg, selectedExtras, youthPrice, childPrice]);

	const toggleExtra = (id: string) => {
		setSelectedExtras((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
	};

	const onBook = () => {
		if (!isLoggedIn) {
			void router.push(loginHref);
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
				<span>When (Date)</span>
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
				))}
			</div>

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

export default PackageBookingPanel;
