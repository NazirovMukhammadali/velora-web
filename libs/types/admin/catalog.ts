import type {
	BookingStatus,
	BookingType,
	FlightCabinClass,
	FlightStatus,
	HotelStatus,
	RentcarCategory,
	RentcarStatus,
	TourStatus,
	TransmissionType,
} from '../../enums/catalog.enum';
import type { TotalCounter } from '../common';
import type { Member } from '../member/member';

export type ListResult<T> = { list: T[]; metaCounter?: TotalCounter[] };

export interface AdminTour {
	_id: string;
	tourTitle: string;
	tourLocation: string;
	tourDays: number;
	tourNights: number;
	tourPrice: number;
	tourImages: string[];
	tourDesc?: string;
	tourStatus: TourStatus;
	tourViews: number;
	tourLikes: number;
	tourSoldCount: number;
	memberId: string;
	memberData?: Member;
	createdAt: string;
}

export interface AdminHotel {
	_id: string;
	hotelName: string;
	hotelLocation: string;
	hotelAddress: string;
	hotelPrice: number;
	hotelStars: number;
	availableRooms: number;
	hotelImages: string[];
	hotelDesc?: string;
	hotelStatus: HotelStatus;
	hotelViews: number;
	hotelLikes: number;
	createdAt: string;
}

export interface AdminRentcar {
	_id: string;
	carTitle: string;
	carLocation: string;
	carCategory: RentcarCategory;
	transmission: TransmissionType;
	seats: number;
	dailyPrice: number;
	availableCars: number;
	carImages: string[];
	carDesc?: string;
	rentcarStatus: RentcarStatus;
	rentcarViews: number;
	rentcarLikes: number;
	createdAt: string;
}

export interface AdminFlight {
	_id: string;
	airline: string;
	flightNumber: string;
	departureAirport: string;
	arrivalAirport: string;
	departureTime: string;
	arrivalTime: string;
	cabinClass: FlightCabinClass;
	availableSeats: number;
	basePrice: number;
	flightStatus: FlightStatus;
	flightViews: number;
	createdAt: string;
}

export interface AdminBooking {
	_id: string;
	bookingType: BookingType;
	bookingStatus: BookingStatus;
	bookingRefId: string;
	memberId: string;
	agentId: string;
	bookingTitle: string;
	bookingPrice: number;
	checkInDate?: string | null;
	checkOutDate?: string | null;
	quantity?: number | null;
	createdAt: string;
	memberData?: Member | null;
}
