/** Mirrors the backend catalog / booking enums (velora-api `libs/enums`). */

export enum TourStatus {
	ACTIVE = 'ACTIVE',
	CLOSED = 'CLOSED',
	DELETE = 'DELETE',
}

export enum HotelStatus {
	ACTIVE = 'ACTIVE',
	CLOSED = 'CLOSED',
	DELETE = 'DELETE',
}

export enum RentcarStatus {
	ACTIVE = 'ACTIVE',
	CLOSED = 'CLOSED',
	DELETE = 'DELETE',
}

export enum RentcarCategory {
	SEDAN = 'SEDAN',
	SUV = 'SUV',
	COUPE = 'COUPE',
	HATCHBACK = 'HATCHBACK',
	VAN = 'VAN',
	PICKUP = 'PICKUP',
}

export enum TransmissionType {
	AUTOMATIC = 'AUTOMATIC',
	MANUAL = 'MANUAL',
}

export enum FlightStatus {
	ACTIVE = 'ACTIVE',
	CANCELLED = 'CANCELLED',
	DELETE = 'DELETE',
}

export enum FlightCabinClass {
	ECONOMY = 'ECONOMY',
	PREMIUM_ECONOMY = 'PREMIUM_ECONOMY',
	BUSINESS = 'BUSINESS',
	FIRST = 'FIRST',
}

export enum BookingType {
	FLIGHT = 'FLIGHT',
	HOTEL = 'HOTEL',
	TOUR = 'TOUR',
	CAR = 'CAR',
}

export enum BookingStatus {
	PENDING = 'PENDING',
	CONFIRMED = 'CONFIRMED',
	CANCELLED = 'CANCELLED',
}
