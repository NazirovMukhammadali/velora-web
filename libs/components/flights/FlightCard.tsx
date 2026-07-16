import Link from 'next/link';
import type { Flight } from '../../data/flights';
import { flightDetailHref } from '../../data/flights';
import { formatPackagePrice } from '../../data/packages';

type FlightCardProps = {
	flight: Flight;
};

const PlaneIcon = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
		<path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0011.5 2 1.5 1.5 0 0010 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" fill="currentColor" />
	</svg>
);

const FlightCard = ({ flight }: FlightCardProps) => {
	const href = flightDetailHref(flight.id);
	const stopsLabel = flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`;

	return (
		<article className={'flight-card'}>
			<div className={'flight-card__airline'}>
				<span className={'flight-card__logo'} aria-hidden>
					{flight.airlineCode}
				</span>
				<div>
					<strong>{flight.airline}</strong>
					<em>
						{flight.flightNumber} · {flight.cabinClass}
					</em>
				</div>
			</div>

			<div className={'flight-card__route'}>
				<div className={'flight-card__point'}>
					<strong>{flight.departureTime ?? '--:--'}</strong>
					<span>{flight.fromAirport}</span>
				</div>
				<div className={'flight-card__path'}>
					<span className={'flight-card__duration'}>{flight.durationLabel ?? 'See details'}</span>
					<div className={'flight-card__line'}>
						<i />
						<PlaneIcon />
					</div>
					<span className={`flight-card__stops ${flight.stops === 0 ? 'is-direct' : ''}`}>{stopsLabel}</span>
				</div>
				<div className={'flight-card__point flight-card__point--end'}>
					<strong>{flight.arrivalTime ?? '--:--'}</strong>
					<span>{flight.toAirport}</span>
				</div>
			</div>

			<div className={'flight-card__fare'}>
				<div className={'flight-card__price'}>
					{flight.oldPrice && <del>{formatPackagePrice(flight.oldPrice)}</del>}
					<strong>{formatPackagePrice(flight.basePrice)}</strong>
					<span>per passenger</span>
				</div>
				<Link href={href} className={'flight-card__cta'}>
					View deal
				</Link>
			</div>
		</article>
	);
};

export default FlightCard;
