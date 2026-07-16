import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import FlightBookingPanel from '../../libs/components/flights/FlightBookingPanel';
import SeoHead from '../../libs/components/common/SeoHead';
import { getFlightById, mapBackendFlight } from '../../libs/data/flights';
import { formatPackagePrice } from '../../libs/data/packages';
import { GET_FLIGHT_DETAIL } from '../../apollo/user/query';
import { FlightDetailSkeleton } from '../../libs/components/common/PackageDetailSkeleton';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const FlightDetailPage: NextPage = () => {
	const router = useRouter();
	const id = typeof router.query.id === 'string' ? router.query.id : '';

	const staticFlight = id ? getFlightById(id) : undefined;

	const { data, loading } = useQuery(GET_FLIGHT_DETAIL, {
		fetchPolicy: 'cache-and-network',
		errorPolicy: 'all',
		variables: { flightId: id },
		skip: !router.isReady || !id || Boolean(staticFlight),
	});

	if (!router.isReady) {
		return (
			<Stack className={'pkg-detail-wrap'}>
				<FlightDetailSkeleton />
			</Stack>
		);
	}

	const apiFlight = data?.getFlightDetail;
	const flight = staticFlight ?? (apiFlight ? mapBackendFlight(apiFlight) : undefined);

	if (!flight) {
		if (loading) {
			return (
				<Stack className={'pkg-detail-wrap'}>
					<FlightDetailSkeleton />
				</Stack>
			);
		}
		return (
			<Stack className={'pkg-detail-page container'} sx={{ py: 6, alignItems: 'center' }}>
				<h2>Flight not found</h2>
				<Link href="/flights">Back to flights</Link>
			</Stack>
		);
	}

	const stopsLabel = flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`;

	return (
		<>
			<SeoHead
				title={`${flight.fromCity} to ${flight.toCity}`}
				description={`Fly ${flight.fromAirport} to ${flight.toAirport} with ${flight.airline}. From ${formatPackagePrice(flight.basePrice)} per passenger — ${stopsLabel}, ${flight.cabinClass}. Book on Velora.`}
			/>
			<Stack className={'pkg-detail-wrap'}>
			<div className={'pkg-detail-page'}>
				<nav className={'pkg-breadcrumb'} aria-label="Breadcrumb">
					<Link href="/">Home</Link>
					<span>›</span>
					<Link href="/flights">Flights</Link>
					<span>›</span>
					<span>
						{flight.fromAirport} → {flight.toAirport}
					</span>
				</nav>

				<header className={'pkg-detail-hero'}>
					<div>
						<h1>
							{flight.fromCity} → {flight.toCity}
						</h1>
						<p className={'pkg-detail-location'}>
							✈ {flight.airline} · {flight.flightNumber}
						</p>
						<p className={'pkg-detail-rating'}>
							{stopsLabel} · {flight.cabinClass}
						</p>
					</div>
					<div className={'pkg-detail-price-head'}>
						<span>From</span>
						<strong>
							{formatPackagePrice(flight.basePrice)}
							<em>/ passenger</em>
						</strong>
					</div>
				</header>

				<div className={'flight-detail-route'}>
					<div className={'flight-detail-point'}>
						<strong>{flight.departureTime ?? '--:--'}</strong>
						<span>{flight.fromAirport}</span>
						<em>{flight.fromCity}</em>
					</div>
					<div className={'flight-detail-path'}>
						<span>{flight.durationLabel ?? 'Schedule on request'}</span>
						<div className={'flight-detail-line'}>
							<i />
						</div>
						<span className={flight.stops === 0 ? 'is-direct' : ''}>{stopsLabel}</span>
					</div>
					<div className={'flight-detail-point flight-detail-point--end'}>
						<strong>{flight.arrivalTime ?? '--:--'}</strong>
						<span>{flight.toAirport}</span>
						<em>{flight.toCity}</em>
					</div>
				</div>

				<div className={'pkg-meta-bar'}>
					<div>
						<span>Airline</span>
						<strong>{flight.airline}</strong>
					</div>
					<div>
						<span>Cabin</span>
						<strong>{flight.cabinClass}</strong>
					</div>
					<div>
						<span>Baggage</span>
						<strong>{flight.baggage}</strong>
					</div>
					<div>
						<span>Refundable</span>
						<strong>{flight.refundable ? 'Yes' : 'No'}</strong>
					</div>
				</div>

				<div className={'pkg-detail-layout'}>
					<div className={'pkg-detail-main'}>
						<section>
							<h2>Flight overview</h2>
							<p>
								Fly {flight.cabinClass.toLowerCase()} from {flight.fromCity} ({flight.fromAirport}) to{' '}
								{flight.toCity} ({flight.toAirport}) with {flight.airline}. This {stopsLabel.toLowerCase()} fare
								includes {flight.baggage.toLowerCase()} and transparent Velora pricing with no hidden fees.
							</p>
						</section>

						<section>
							<h2>What’s included</h2>
							<ul className={'pkg-check-list'}>
								<li>Seat selection during booking</li>
								<li>{flight.baggage}</li>
								<li>Velora 24/7 trip support</li>
								<li>{flight.refundable ? 'Free changes & refunds' : 'Best-price economy fare'}</li>
							</ul>
						</section>

						<section>
							<h2>Good to know</h2>
							<ul className={'pkg-x-list'}>
								<li>Arrive at the airport at least 2 hours before departure.</li>
								<li>Travel documents and visas are the traveler’s responsibility.</li>
								<li>Seats and fares are subject to availability at time of booking.</li>
							</ul>
						</section>
					</div>

					<FlightBookingPanel flight={flight} />
				</div>
			</div>
		</Stack>
		</>
	);
};

export default withLayoutBasic(FlightDetailPage);
