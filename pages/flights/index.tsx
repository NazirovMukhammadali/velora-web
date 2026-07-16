import React from 'react';
import { NextPage } from 'next';
import type { ParsedUrlQuery } from 'querystring';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import FlightCard from '../../libs/components/flights/FlightCard';
import { FlightListSkeleton } from '../../libs/components/common/FlightCardSkeleton';
import { getFlights, mapBackendFlights, type Flight } from '../../libs/data/flights';
import { GET_FLIGHTS } from '../../apollo/user/query';
import usePackageCatalog from '../../libs/hooks/usePackageCatalog';

const FLIGHT_FILTER_DEFAULTS = {
	from: '',
	to: '',
	sort: 'recommended',
};

const mapHeroLocationToTo = (query: ParsedUrlQuery) => {
	const patch: Partial<typeof FLIGHT_FILTER_DEFAULTS> = {};
	if (typeof query.location === 'string' && query.location && !query.to) {
		patch.to = query.location;
	}
	return patch;
};

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const durationToMinutes = (label?: string): number => {
	if (!label) return Number.MAX_SAFE_INTEGER;
	const match = label.match(/(\d+)h\s*(\d+)?m?/);
	if (!match) return Number.MAX_SAFE_INTEGER;
	return Number(match[1]) * 60 + Number(match[2] ?? 0);
};

const sortFlights = (list: Flight[], sort: string): Flight[] => {
	const cloned = [...list];
	switch (sort) {
		case 'priceAsc':
			return cloned.sort((a, b) => a.basePrice - b.basePrice);
		case 'priceDesc':
			return cloned.sort((a, b) => b.basePrice - a.basePrice);
		case 'duration':
			return cloned.sort((a, b) => durationToMinutes(a.durationLabel) - durationToMinutes(b.durationLabel));
		default:
			return cloned;
	}
};

const matchesRoute = (flight: Flight, fromQuery: string, toQuery: string): boolean => {
	const from = fromQuery.trim().toLowerCase();
	const to = toQuery.trim().toLowerCase();
	const matchFrom =
		!from || flight.fromCity.toLowerCase().includes(from) || flight.fromAirport.toLowerCase().includes(from);
	const matchTo = !to || flight.toCity.toLowerCase().includes(to) || flight.toAirport.toLowerCase().includes(to);
	return matchFrom && matchTo;
};

const FlightsPage: NextPage = () => {
	const { filters, setFilter, items, total, isInitialLoading } = usePackageCatalog<
		Flight,
		typeof FLIGHT_FILTER_DEFAULTS
	>({
		query: GET_FLIGHTS,
		selectList: (data) => data?.getFlights?.list,
		mapApi: mapBackendFlights,
		fallback: getFlights,
		filterDefaults: FLIGHT_FILTER_DEFAULTS,
		catalogOptions: {
			debounceKeys: ['from', 'to'],
			mapQuery: mapHeroLocationToTo,
			stripQueryKeys: ['location'],
		},
		filterItem: (flight, f) => matchesRoute(flight, f.from, f.to),
		sortItems: sortFlights,
	});

	return (
		<Stack className={'flights-page'}>
			<Stack className={'container'}>
				<div className={'catalog-intro'}>
					<span className={'catalog-eyebrow'}>Flights</span>
					<h1 className={'catalog-title'}>Search flights</h1>
					<p className={'catalog-sub'}>
						Compare fares across airlines with clear pricing — pick a route, sort by what matters, and open any flight
						for full schedule and booking.
					</p>
				</div>
			</Stack>

			<Stack className={'flights-toolbar container'}>
				<div className={'flights-search'}>
					<label className={'flights-field'}>
						<span>From</span>
						<input
							type="text"
							placeholder="City or airport"
							value={filters.from}
							onChange={(event) => setFilter('from', event.target.value)}
						/>
					</label>
					<span className={'flights-swap'} aria-hidden>
						⇄
					</span>
					<label className={'flights-field'}>
						<span>To</span>
						<input
							type="text"
							placeholder="City or airport"
							value={filters.to}
							onChange={(event) => setFilter('to', event.target.value)}
						/>
					</label>
				</div>

				<div className={'flights-sort'}>
					<label htmlFor="flights-sort">Sort by</label>
					<select id="flights-sort" value={filters.sort} onChange={(event) => setFilter('sort', event.target.value)}>
						<option value="recommended">Recommended</option>
						<option value="priceAsc">Price · Low to High</option>
						<option value="priceDesc">Price · High to Low</option>
						<option value="duration">Shortest duration</option>
					</select>
				</div>
			</Stack>

			<Stack className={'container'}>
				<p className={'catalog-count'}>
					{total} {total === 1 ? 'flight' : 'flights'} found
				</p>
			</Stack>

			<Stack className={'flights-list container'}>
				{isInitialLoading ? (
					<FlightListSkeleton count={6} />
				) : items.length === 0 ? (
					<div className={'tours-empty'}>No flights match your search yet.</div>
				) : (
					items.map((flight) => <FlightCard key={flight.id} flight={flight} />)
				)}
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(FlightsPage);
