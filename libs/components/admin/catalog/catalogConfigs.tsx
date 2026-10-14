import React from 'react';
import { Star } from 'phosphor-react';
import type { CatalogConfig } from './AdminCatalogManager';
import type { AdminFormValues } from '../common/AdminFormDialog';
import { fromLocalDateTimeInput, splitImageLines, toLocalDateTimeInput } from '../common/adminForm';
import { ItemCell, PersonCell, formatAdminDate, formatMoney } from '../common/cells';
import { humanize } from '../common/StatusChip';
import {
	GET_ALL_FLIGHTS_BY_ADMIN,
	GET_ALL_HOTELS_BY_ADMIN,
	GET_ALL_RENTCARS_BY_ADMIN,
	GET_ALL_TOURS_BY_ADMIN,
} from '../../../../apollo/admin/query';
import {
	CREATE_FLIGHT,
	CREATE_HOTEL,
	CREATE_RENTCAR,
	REMOVE_FLIGHT_BY_ADMIN,
	REMOVE_HOTEL_BY_ADMIN,
	REMOVE_RENTCAR_BY_ADMIN,
	REMOVE_TOUR_BY_ADMIN,
	UPDATE_FLIGHT_BY_ADMIN,
	UPDATE_HOTEL_BY_ADMIN,
	UPDATE_RENTCAR_BY_ADMIN,
	UPDATE_TOUR_BY_ADMIN,
} from '../../../../apollo/admin/mutation';
import {
	FlightCabinClass,
	FlightStatus,
	HotelStatus,
	RentcarCategory,
	RentcarStatus,
	TourStatus,
	TransmissionType,
} from '../../../enums/catalog.enum';
import type { AdminFlight, AdminHotel, AdminRentcar, AdminTour } from '../../../types/admin/catalog';
import { packageDetailHref } from '../../../data/packages';
import { flightDetailHref } from '../../../data/flights';

const str = (value?: string | number | null) => (value === undefined || value === null ? '' : String(value));
const num = (value: string) => Number(value);
const optionalText = (value: string) => value.trim() || undefined;
const images = (list?: string[] | null) => (list ?? []).join('\n');

/**************************
 *          TOURS         *
 *************************/

export const tourConfig: CatalogConfig<AdminTour> = {
	entity: 'Tour',
	listQuery: GET_ALL_TOURS_BY_ADMIN,
	listField: 'getAllToursByAdmin',
	statusField: 'tourStatus',
	statuses: Object.values(TourStatus),
	deleteStatus: TourStatus.DELETE,
	searchPlaceholder: 'Search by title or city',
	createNote: 'Tours are published by agents',
	columns: [
		{
			label: 'Tour',
			render: (row) => (
				<ItemCell
					image={row.tourImages?.[0]}
					title={row.tourTitle}
					subtitle={`${row.tourLocation} · ${row.tourDays}D${row.tourNights ? ` / ${row.tourNights}N` : ''}`}
				/>
			),
		},
		{ label: 'Agent', render: (row) => <PersonCell member={row.memberData} /> },
		{ label: 'Price', align: 'right', render: (row) => <strong>{formatMoney(row.tourPrice)}</strong> },
		{ label: 'Sold', align: 'center', render: (row) => row.tourSoldCount ?? 0 },
		{ label: 'Views', align: 'center', render: (row) => row.tourViews ?? 0 },
		{ label: 'Created', render: (row) => formatAdminDate(row.createdAt) },
	],
	publicHref: (row) => packageDetailHref('tours', row._id),
	updateMutation: UPDATE_TOUR_BY_ADMIN,
	removeMutation: REMOVE_TOUR_BY_ADMIN,
	removeVariable: 'tourId',
	fields: [
		{ name: 'tourTitle', label: 'Title', type: 'text', required: true, minLength: 3, maxLength: 120 },
		{ name: 'tourLocation', label: 'City / region', type: 'text', required: true, maxLength: 100, half: true },
		{ name: 'tourPrice', label: 'Price (USD)', type: 'number', required: true, min: 0, half: true },
		{ name: 'tourDays', label: 'Days', type: 'number', required: true, min: 1, half: true },
		{ name: 'tourNights', label: 'Nights', type: 'number', min: 0, half: true },
		{ name: 'tourImages', label: 'Images', type: 'images', required: true },
		{ name: 'tourDesc', label: 'Description', type: 'textarea', minLength: 5, maxLength: 500 },
	],
	toForm: (row) => ({
		tourTitle: str(row?.tourTitle),
		tourLocation: str(row?.tourLocation),
		tourPrice: str(row?.tourPrice),
		tourDays: str(row?.tourDays ?? 1),
		tourNights: str(row?.tourNights ?? 0),
		tourImages: images(row?.tourImages),
		tourDesc: str(row?.tourDesc),
	}),
	toInput: (v: AdminFormValues) => ({
		tourTitle: v.tourTitle.trim(),
		tourLocation: v.tourLocation.trim(),
		tourPrice: num(v.tourPrice),
		tourDays: num(v.tourDays),
		tourNights: v.tourNights ? num(v.tourNights) : 0,
		tourImages: splitImageLines(v.tourImages),
		tourDesc: optionalText(v.tourDesc),
	}),
};

/**************************
 *         HOTELS         *
 *************************/

export const hotelConfig: CatalogConfig<AdminHotel> = {
	entity: 'Hotel',
	listQuery: GET_ALL_HOTELS_BY_ADMIN,
	listField: 'getAllHotelsByAdmin',
	statusField: 'hotelStatus',
	statuses: Object.values(HotelStatus),
	deleteStatus: HotelStatus.DELETE,
	searchPlaceholder: 'Search by name, city or address',
	columns: [
		{
			label: 'Hotel',
			render: (row) => <ItemCell image={row.hotelImages?.[0]} title={row.hotelName} subtitle={row.hotelAddress} />,
		},
		{ label: 'City', render: (row) => row.hotelLocation },
		{
			label: 'Stars',
			align: 'center',
			render: (row) => (
				<span className="va-stars">
					{row.hotelStars} <Star size={14} weight="fill" />
				</span>
			),
		},
		{ label: 'Per night', align: 'right', render: (row) => <strong>{formatMoney(row.hotelPrice)}</strong> },
		{ label: 'Rooms left', align: 'center', render: (row) => row.availableRooms ?? 0 },
		{ label: 'Views', align: 'center', render: (row) => row.hotelViews ?? 0 },
	],
	publicHref: (row) => packageDetailHref('hotels', row._id),
	createMutation: CREATE_HOTEL,
	updateMutation: UPDATE_HOTEL_BY_ADMIN,
	removeMutation: REMOVE_HOTEL_BY_ADMIN,
	removeVariable: 'hotelId',
	fields: [
		{ name: 'hotelName', label: 'Hotel name', type: 'text', required: true, maxLength: 120 },
		{ name: 'hotelLocation', label: 'City', type: 'text', required: true, maxLength: 100, half: true },
		{ name: 'hotelStars', label: 'Stars (1–5)', type: 'number', required: true, min: 1, max: 5, half: true },
		{ name: 'hotelAddress', label: 'Address', type: 'text', required: true, minLength: 3, maxLength: 200 },
		{ name: 'hotelPrice', label: 'Price per night (USD)', type: 'number', required: true, min: 0, half: true },
		{ name: 'availableRooms', label: 'Available rooms', type: 'number', min: 0, half: true },
		{ name: 'hotelImages', label: 'Images', type: 'images', required: true },
		{ name: 'hotelDesc', label: 'Description', type: 'textarea', minLength: 5, maxLength: 700 },
	],
	toForm: (row) => ({
		hotelName: str(row?.hotelName),
		hotelLocation: str(row?.hotelLocation),
		hotelStars: str(row?.hotelStars ?? 4),
		hotelAddress: str(row?.hotelAddress),
		hotelPrice: str(row?.hotelPrice),
		availableRooms: str(row?.availableRooms ?? 10),
		hotelImages: images(row?.hotelImages),
		hotelDesc: str(row?.hotelDesc),
	}),
	toInput: (v) => ({
		hotelName: v.hotelName.trim(),
		hotelLocation: v.hotelLocation.trim(),
		hotelStars: num(v.hotelStars),
		hotelAddress: v.hotelAddress.trim(),
		hotelPrice: num(v.hotelPrice),
		availableRooms: v.availableRooms ? num(v.availableRooms) : 0,
		hotelImages: splitImageLines(v.hotelImages),
		hotelDesc: optionalText(v.hotelDesc),
	}),
};

/**************************
 *        RENT CARS       *
 *************************/

export const rentcarConfig: CatalogConfig<AdminRentcar> = {
	entity: 'Car',
	listQuery: GET_ALL_RENTCARS_BY_ADMIN,
	listField: 'getAllRentcarsByAdmin',
	statusField: 'rentcarStatus',
	statuses: Object.values(RentcarStatus),
	deleteStatus: RentcarStatus.DELETE,
	searchPlaceholder: 'Search by model or city',
	filters: [{ key: 'category', label: 'Category', searchKey: 'carCategory', options: Object.values(RentcarCategory) }],
	columns: [
		{
			label: 'Car',
			render: (row) => (
				<ItemCell
					image={row.carImages?.[0]}
					title={row.carTitle}
					subtitle={`${humanize(row.carCategory)} · ${humanize(row.transmission)} · ${row.seats} seats`}
				/>
			),
		},
		{ label: 'City', render: (row) => row.carLocation },
		{ label: 'Per day', align: 'right', render: (row) => <strong>{formatMoney(row.dailyPrice)}</strong> },
		{ label: 'Available', align: 'center', render: (row) => row.availableCars ?? 0 },
		{ label: 'Views', align: 'center', render: (row) => row.rentcarViews ?? 0 },
	],
	publicHref: (row) => packageDetailHref('cars', row._id),
	createMutation: CREATE_RENTCAR,
	updateMutation: UPDATE_RENTCAR_BY_ADMIN,
	removeMutation: REMOVE_RENTCAR_BY_ADMIN,
	removeVariable: 'rentcarId',
	fields: [
		{ name: 'carTitle', label: 'Model', type: 'text', required: true, minLength: 3, maxLength: 120 },
		{ name: 'carLocation', label: 'City', type: 'text', required: true, maxLength: 100, half: true },
		{
			name: 'carCategory',
			label: 'Category',
			type: 'select',
			required: true,
			options: Object.values(RentcarCategory),
			half: true,
		},
		{
			name: 'transmission',
			label: 'Transmission',
			type: 'select',
			options: Object.values(TransmissionType),
			half: true,
		},
		{ name: 'seats', label: 'Seats', type: 'number', required: true, min: 1, max: 16, half: true },
		{ name: 'dailyPrice', label: 'Price per day (USD)', type: 'number', required: true, min: 0, half: true },
		{ name: 'availableCars', label: 'Cars available', type: 'number', min: 0, half: true },
		{ name: 'carImages', label: 'Images', type: 'images', required: true },
		{ name: 'carDesc', label: 'Description', type: 'textarea', minLength: 5, maxLength: 700 },
	],
	toForm: (row) => ({
		carTitle: str(row?.carTitle),
		carLocation: str(row?.carLocation),
		carCategory: str(row?.carCategory ?? RentcarCategory.SEDAN),
		transmission: str(row?.transmission ?? TransmissionType.AUTOMATIC),
		seats: str(row?.seats ?? 5),
		dailyPrice: str(row?.dailyPrice),
		availableCars: str(row?.availableCars ?? 3),
		carImages: images(row?.carImages),
		carDesc: str(row?.carDesc),
	}),
	toInput: (v) => ({
		carTitle: v.carTitle.trim(),
		carLocation: v.carLocation.trim(),
		carCategory: v.carCategory,
		transmission: v.transmission || undefined,
		seats: num(v.seats),
		dailyPrice: num(v.dailyPrice),
		availableCars: v.availableCars ? num(v.availableCars) : 0,
		carImages: splitImageLines(v.carImages),
		carDesc: optionalText(v.carDesc),
	}),
};

/**************************
 *         FLIGHTS        *
 *************************/

export const flightConfig: CatalogConfig<AdminFlight> = {
	entity: 'Flight',
	listQuery: GET_ALL_FLIGHTS_BY_ADMIN,
	listField: 'getAllFlightsByAdmin',
	statusField: 'flightStatus',
	statuses: Object.values(FlightStatus),
	deleteStatus: FlightStatus.DELETE,
	searchPlaceholder: 'Search by flight no., airline or airport',
	columns: [
		{
			label: 'Flight',
			render: (row) => (
				<div className="va-route">
					<strong>
						{row.departureAirport} <span aria-hidden>→</span> {row.arrivalAirport}
					</strong>
					<small>
						{row.flightNumber} · {row.airline}
					</small>
				</div>
			),
		},
		{ label: 'Departure', render: (row) => formatAdminDate(row.departureTime, 'dd MMM yyyy, HH:mm') },
		{ label: 'Arrival', render: (row) => formatAdminDate(row.arrivalTime, 'dd MMM yyyy, HH:mm') },
		{ label: 'Cabin', render: (row) => humanize(row.cabinClass) },
		{ label: 'Fare', align: 'right', render: (row) => <strong>{formatMoney(row.basePrice)}</strong> },
		{ label: 'Seats', align: 'center', render: (row) => row.availableSeats ?? 0 },
	],
	publicHref: (row) => flightDetailHref(row._id),
	createMutation: CREATE_FLIGHT,
	updateMutation: UPDATE_FLIGHT_BY_ADMIN,
	removeMutation: REMOVE_FLIGHT_BY_ADMIN,
	removeVariable: 'flightId',
	fields: [
		{ name: 'airline', label: 'Airline', type: 'text', required: true, maxLength: 80, half: true },
		{ name: 'flightNumber', label: 'Flight number', type: 'text', required: true, maxLength: 12, half: true },
		{
			name: 'departureAirport',
			label: 'From (IATA)',
			type: 'text',
			required: true,
			maxLength: 4,
			half: true,
			helper: 'e.g. TAS',
		},
		{
			name: 'arrivalAirport',
			label: 'To (IATA)',
			type: 'text',
			required: true,
			maxLength: 4,
			half: true,
			helper: 'e.g. ICN',
		},
		{ name: 'departureTime', label: 'Departure', type: 'datetime', required: true, half: true },
		{ name: 'arrivalTime', label: 'Arrival', type: 'datetime', required: true, half: true },
		{
			name: 'cabinClass',
			label: 'Cabin class',
			type: 'select',
			required: true,
			options: Object.values(FlightCabinClass),
			half: true,
		},
		{ name: 'basePrice', label: 'Fare (USD)', type: 'number', required: true, min: 0, half: true },
		{ name: 'availableSeats', label: 'Available seats', type: 'number', required: true, min: 0, half: true },
	],
	toForm: (row) => ({
		airline: str(row?.airline),
		flightNumber: str(row?.flightNumber),
		departureAirport: str(row?.departureAirport),
		arrivalAirport: str(row?.arrivalAirport),
		departureTime: toLocalDateTimeInput(row?.departureTime),
		arrivalTime: toLocalDateTimeInput(row?.arrivalTime),
		cabinClass: str(row?.cabinClass ?? FlightCabinClass.ECONOMY),
		basePrice: str(row?.basePrice),
		availableSeats: str(row?.availableSeats ?? 120),
	}),
	toInput: (v) => ({
		airline: v.airline.trim(),
		flightNumber: v.flightNumber.trim().toUpperCase(),
		departureAirport: v.departureAirport.trim().toUpperCase(),
		arrivalAirport: v.arrivalAirport.trim().toUpperCase(),
		departureTime: fromLocalDateTimeInput(v.departureTime),
		arrivalTime: fromLocalDateTimeInput(v.arrivalTime),
		cabinClass: v.cabinClass,
		basePrice: num(v.basePrice),
		availableSeats: num(v.availableSeats),
	}),
	validate: (v) => {
		const errors: Record<string, string> = {};
		const from = v.departureAirport.trim().toUpperCase();
		if (from && from === v.arrivalAirport.trim().toUpperCase()) errors.arrivalAirport = 'Must differ from departure';
		if (v.departureTime && v.arrivalTime && new Date(v.arrivalTime) <= new Date(v.departureTime)) {
			errors.arrivalTime = 'Arrival must be after departure';
		}
		return errors;
	},
};
