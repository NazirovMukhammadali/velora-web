import { REACT_APP_API_URL } from '../config';

export type Flight = {
	id: string;
	airline: string;
	airlineCode: string;
	flightNumber: string;
	fromCity: string;
	fromAirport: string;
	toCity: string;
	toAirport: string;
	departureTime?: string;
	arrivalTime?: string;
	durationLabel?: string;
	stops: number;
	cabinClass: string;
	basePrice: number;
	oldPrice?: number;
	baggage: string;
	refundable: boolean;
};

const FLIGHTS: Flight[] = [
	{
		id: 'va204-jfk-lhr',
		airline: 'Velora Air',
		airlineCode: 'VA',
		flightNumber: 'VA204',
		fromCity: 'New York',
		fromAirport: 'JFK',
		toCity: 'London',
		toAirport: 'LHR',
		departureTime: '08:30',
		arrivalTime: '20:50',
		durationLabel: '7h 20m',
		stops: 0,
		cabinClass: 'Economy',
		basePrice: 540,
		oldPrice: 620,
		baggage: '1 × 23kg checked',
		refundable: true,
	},
	{
		id: 'sj88-dxb-cdg',
		airline: 'SkyJet',
		airlineCode: 'SJ',
		flightNumber: 'SJ88',
		fromCity: 'Dubai',
		fromAirport: 'DXB',
		toCity: 'Paris',
		toAirport: 'CDG',
		departureTime: '02:10',
		arrivalTime: '07:05',
		durationLabel: '7h 55m',
		stops: 0,
		cabinClass: 'Economy',
		basePrice: 410,
		oldPrice: 480,
		baggage: '1 × 30kg checked',
		refundable: false,
	},
	{
		id: 'na512-nrt-sfo',
		airline: 'Nimbus Airways',
		airlineCode: 'NA',
		flightNumber: 'NA512',
		fromCity: 'Tokyo',
		fromAirport: 'NRT',
		toCity: 'San Francisco',
		toAirport: 'SFO',
		departureTime: '17:40',
		arrivalTime: '10:25',
		durationLabel: '9h 45m',
		stops: 0,
		cabinClass: 'Premium Economy',
		basePrice: 880,
		oldPrice: 990,
		baggage: '2 × 23kg checked',
		refundable: true,
	},
	{
		id: 'az33-fco-jfk',
		airline: 'AzzurroJet',
		airlineCode: 'AZ',
		flightNumber: 'AZ33',
		fromCity: 'Rome',
		fromAirport: 'FCO',
		toCity: 'New York',
		toAirport: 'JFK',
		departureTime: '11:15',
		arrivalTime: '15:05',
		durationLabel: '9h 50m',
		stops: 1,
		cabinClass: 'Economy',
		basePrice: 495,
		baggage: '1 × 23kg checked',
		refundable: false,
	},
	{
		id: 'va771-sin-syd',
		airline: 'Velora Air',
		airlineCode: 'VA',
		flightNumber: 'VA771',
		fromCity: 'Singapore',
		fromAirport: 'SIN',
		toCity: 'Sydney',
		toAirport: 'SYD',
		departureTime: '21:30',
		arrivalTime: '08:05',
		durationLabel: '8h 35m',
		stops: 0,
		cabinClass: 'Business',
		basePrice: 1320,
		oldPrice: 1490,
		baggage: '2 × 32kg checked',
		refundable: true,
	},
	{
		id: 'sj19-ist-dxb',
		airline: 'SkyJet',
		airlineCode: 'SJ',
		flightNumber: 'SJ19',
		fromCity: 'Istanbul',
		fromAirport: 'IST',
		toCity: 'Dubai',
		toAirport: 'DXB',
		departureTime: '06:45',
		arrivalTime: '11:55',
		durationLabel: '4h 10m',
		stops: 0,
		cabinClass: 'Economy',
		basePrice: 230,
		oldPrice: 280,
		baggage: '1 × 20kg checked',
		refundable: false,
	},
	{
		id: 'na204-lhr-bcn',
		airline: 'Nimbus Airways',
		airlineCode: 'NA',
		flightNumber: 'NA204',
		fromCity: 'London',
		fromAirport: 'LHR',
		toCity: 'Barcelona',
		toAirport: 'BCN',
		departureTime: '14:20',
		arrivalTime: '17:40',
		durationLabel: '2h 20m',
		stops: 0,
		cabinClass: 'Economy',
		basePrice: 145,
		oldPrice: 180,
		baggage: 'Cabin only',
		refundable: false,
	},
	{
		id: 'az88-cdg-jfk',
		airline: 'AzzurroJet',
		airlineCode: 'AZ',
		flightNumber: 'AZ88',
		fromCity: 'Paris',
		fromAirport: 'CDG',
		toCity: 'New York',
		toAirport: 'JFK',
		departureTime: '13:05',
		arrivalTime: '15:35',
		durationLabel: '8h 30m',
		stops: 0,
		cabinClass: 'Business',
		basePrice: 1180,
		oldPrice: 1350,
		baggage: '2 × 32kg checked',
		refundable: true,
	},
];

export const getFlights = (): Flight[] => FLIGHTS;

export const getFlightById = (id: string): Flight | undefined => FLIGHTS.find((flight) => flight.id === id);

export const flightDetailHref = (id: string): string => `/flights/detail?id=${id}`;

/** Extract HH:MM from an ISO/date string or pass through an existing HH:MM value. */
const toClock = (value?: string | null): string | undefined => {
	if (!value) return undefined;
	if (/^\d{2}:\d{2}$/.test(value)) return value;
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return undefined;
	return date.toISOString().slice(11, 16);
};

const durationBetween = (start?: string | null, end?: string | null): string | undefined => {
	if (!start || !end) return undefined;
	const s = new Date(start).getTime();
	const e = new Date(end).getTime();
	if (Number.isNaN(s) || Number.isNaN(e) || e <= s) return undefined;
	const mins = Math.round((e - s) / 60000);
	return `${Math.floor(mins / 60)}h ${mins % 60}m`;
};

type BackendFlight = {
	_id: string;
	airline: string;
	flightNumber: string;
	departureAirport: string;
	arrivalAirport: string;
	departureTime?: string;
	arrivalTime?: string;
	basePrice: number;
};

/** Map a backend flight to the Flight model (times are only present on the detail query). */
export const mapBackendFlight = (flight: BackendFlight): Flight => ({
	id: flight._id,
	airline: flight.airline,
	airlineCode: flight.airline?.slice(0, 2).toUpperCase() || 'VA',
	flightNumber: flight.flightNumber,
	fromCity: flight.departureAirport,
	fromAirport: flight.departureAirport,
	toCity: flight.arrivalAirport,
	toAirport: flight.arrivalAirport,
	departureTime: toClock(flight.departureTime),
	arrivalTime: toClock(flight.arrivalTime),
	durationLabel: durationBetween(flight.departureTime, flight.arrivalTime),
	stops: 0,
	cabinClass: 'Economy',
	basePrice: flight.basePrice,
	baggage: '1 × 23kg checked',
	refundable: false,
});

export const mapBackendFlights = (list?: BackendFlight[] | null): Flight[] => (list ?? []).map(mapBackendFlight);

/** Reserved for future airline logo assets served by the API. */
export const resolveAirlineLogo = (path?: string | null): string | null => {
	if (!path) return null;
	if (/^https?:\/\//.test(path)) return path;
	return `${REACT_APP_API_URL}/${path.replace(/^\/+/, '')}`;
};
