import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
	mutation UpdateMemberByAdmin($input: MemberUpdate!) {
		updateMemberByAdmin(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberProperties
			memberRank
			memberArticles
			memberPoints
			memberLikes
			memberViews
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation UpdateBoardArticleByAdmin($input: BoardArticleUpdate!) {
		updateBoardArticleByAdmin(input: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation RemoveBoardArticleByAdmin($input: String!) {
		removeBoardArticleByAdmin(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

/**************************
 *      NOTICE / CS       *
 *************************/

export const CREATE_NOTICE_BY_ADMIN = gql`
	mutation CreateNoticeByAdmin($input: NoticeInput!) {
		createNoticeByAdmin(input: $input) {
			_id
			noticeCategory
			noticeStatus
			noticeTitle
			noticeContent
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_NOTICE_BY_ADMIN = gql`
	mutation UpdateNoticeByAdmin($input: NoticeUpdate!) {
		updateNoticeByAdmin(input: $input) {
			_id
			noticeCategory
			noticeStatus
			noticeTitle
			noticeContent
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_NOTICE_BY_ADMIN = gql`
	mutation RemoveNoticeByAdmin($noticeId: String!) {
		removeNoticeByAdmin(noticeId: $noticeId) {
			_id
		}
	}
`;

/**************************
 *        CATALOG         *
 *************************/

export const UPDATE_TOUR_BY_ADMIN = gql`
	mutation UpdateTourByAdmin($input: TourUpdate!) {
		updateTourByAdmin(input: $input) {
			_id
			tourStatus
		}
	}
`;

export const REMOVE_TOUR_BY_ADMIN = gql`
	mutation RemoveTourByAdmin($tourId: ID!) {
		removeTourByAdmin(tourId: $tourId) {
			_id
		}
	}
`;

export const CREATE_HOTEL = gql`
	mutation CreateHotel($input: HotelInput!) {
		createHotel(input: $input) {
			_id
		}
	}
`;

export const UPDATE_HOTEL_BY_ADMIN = gql`
	mutation UpdateHotelByAdmin($input: HotelUpdate!) {
		updateHotelByAdmin(input: $input) {
			_id
			hotelStatus
		}
	}
`;

export const REMOVE_HOTEL_BY_ADMIN = gql`
	mutation RemoveHotelByAdmin($hotelId: ID!) {
		removeHotelByAdmin(hotelId: $hotelId) {
			_id
		}
	}
`;

export const CREATE_RENTCAR = gql`
	mutation CreateRentcar($input: RentcarInput!) {
		createRentcar(input: $input) {
			_id
		}
	}
`;

export const UPDATE_RENTCAR_BY_ADMIN = gql`
	mutation UpdateRentcarByAdmin($input: RentcarUpdate!) {
		updateRentcarByAdmin(input: $input) {
			_id
			rentcarStatus
		}
	}
`;

export const REMOVE_RENTCAR_BY_ADMIN = gql`
	mutation RemoveRentcarByAdmin($rentcarId: ID!) {
		removeRentcarByAdmin(rentcarId: $rentcarId) {
			_id
		}
	}
`;

export const CREATE_FLIGHT = gql`
	mutation CreateFlight($input: FlightInput!) {
		createFlight(input: $input) {
			_id
		}
	}
`;

export const UPDATE_FLIGHT_BY_ADMIN = gql`
	mutation UpdateFlightByAdmin($input: FlightUpdate!) {
		updateFlightByAdmin(input: $input) {
			_id
			flightStatus
		}
	}
`;

export const REMOVE_FLIGHT_BY_ADMIN = gql`
	mutation RemoveFlightByAdmin($flightId: ID!) {
		removeFlightByAdmin(flightId: $flightId) {
			_id
		}
	}
`;

/**************************
 *        BOOKINGS        *
 *************************/

export const CONFIRM_TOUR_BOOKING_BY_ADMIN = gql`
	mutation ConfirmTourBookingByAdmin($input: ConfirmBookingByAdminInput!) {
		confirmTourBookingByAdmin(input: $input) {
			_id
			bookingStatus
		}
	}
`;

export const CANCEL_TOUR_BOOKING_BY_ADMIN = gql`
	mutation CancelTourBookingByAdmin($input: CancelBookingByAdminInput!) {
		cancelTourBookingByAdmin(input: $input) {
			_id
			bookingStatus
		}
	}
`;

export const CONFIRM_HOTEL_BOOKING_BY_ADMIN = gql`
	mutation ConfirmHotelBookingByAdmin($input: ConfirmBookingByAdminInput!) {
		confirmHotelBookingByAdmin(input: $input) {
			_id
			bookingStatus
		}
	}
`;

export const CANCEL_HOTEL_BOOKING_BY_ADMIN = gql`
	mutation CancelHotelBookingByAdmin($input: CancelBookingByAdminInput!) {
		cancelHotelBookingByAdmin(input: $input) {
			_id
			bookingStatus
		}
	}
`;
