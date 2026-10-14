import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_ALL_MEMBERS_BY_ADMIN = gql`
	query GetAllMembersByAdmin($input: MembersInquiry!) {
		getAllMembersByAdmin(input: $input) {
			list {
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
				memberWarnings
				memberBlocks
				memberProperties
				memberRank
				memberArticles
				memberPoints
				memberLikes
				memberViews
				deletedAt
				createdAt
				updatedAt
				accessToken
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const GET_ALL_BOARD_ARTICLES_BY_ADMIN = gql`
	query GetAllBoardArticlesByAdmin($input: AllBoardArticlesInquiry!) {
		getAllBoardArticlesByAdmin(input: $input) {
			list {
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
				memberData {
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
					memberWarnings
					memberBlocks
					memberProperties
					memberRank
					memberPoints
					memberLikes
					memberViews
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

/**************************
 *      NOTICE / CS       *
 *************************/

export const GET_ALL_NOTICES_BY_ADMIN = gql`
	query GetAllNoticesByAdmin($input: AllNoticesInquiry!) {
		getAllNoticesByAdmin(input: $input) {
			list {
				_id
				noticeCategory
				noticeStatus
				noticeTitle
				noticeContent
				memberId
				createdAt
				updatedAt
				memberData {
					_id
					memberNick
					memberFullName
					memberImage
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *        CATALOG         *
 *************************/

export const GET_ALL_TOURS_BY_ADMIN = gql`
	query GetAllToursByAdmin($input: AllToursInquiry!) {
		getAllToursByAdmin(input: $input) {
			list {
				_id
				tourTitle
				tourLocation
				tourDays
				tourNights
				tourPrice
				tourImages
				tourDesc
				tourStatus
				tourViews
				tourLikes
				tourSoldCount
				memberId
				createdAt
				memberData {
					_id
					memberNick
					memberFullName
					memberImage
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_ALL_HOTELS_BY_ADMIN = gql`
	query GetAllHotelsByAdmin($input: AllHotelsInquiry!) {
		getAllHotelsByAdmin(input: $input) {
			list {
				_id
				hotelName
				hotelLocation
				hotelAddress
				hotelPrice
				hotelStars
				availableRooms
				hotelImages
				hotelDesc
				hotelStatus
				hotelViews
				hotelLikes
				createdAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_ALL_RENTCARS_BY_ADMIN = gql`
	query GetAllRentcarsByAdmin($input: AllRentcarsInquiry!) {
		getAllRentcarsByAdmin(input: $input) {
			list {
				_id
				carTitle
				carLocation
				carCategory
				transmission
				seats
				dailyPrice
				availableCars
				carImages
				carDesc
				rentcarStatus
				rentcarViews
				rentcarLikes
				createdAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_ALL_FLIGHTS_BY_ADMIN = gql`
	query GetAllFlightsByAdmin($input: AllFlightsInquiry!) {
		getAllFlightsByAdmin(input: $input) {
			list {
				_id
				airline
				flightNumber
				departureAirport
				arrivalAirport
				departureTime
				arrivalTime
				cabinClass
				availableSeats
				basePrice
				flightStatus
				flightViews
				createdAt
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *        BOOKINGS        *
 *************************/

export const GET_ALL_BOOKINGS_BY_ADMIN = gql`
	query GetAllBookingsByAdmin($input: AllBookingsInquiry!) {
		getAllBookingsByAdmin(input: $input) {
			list {
				_id
				bookingType
				bookingStatus
				bookingRefId
				memberId
				agentId
				bookingTitle
				bookingPrice
				checkInDate
				checkOutDate
				quantity
				createdAt
				memberData {
					_id
					memberNick
					memberFullName
					memberImage
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *        DASHBOARD       *
 *************************/

export const GET_ADMIN_DASHBOARD = gql`
	query GetAdminDashboard(
		$members: MembersInquiry!
		$agents: MembersInquiry!
		$tours: AllToursInquiry!
		$hotels: AllHotelsInquiry!
		$rentcars: AllRentcarsInquiry!
		$flights: AllFlightsInquiry!
		$pendingBookings: AllBookingsInquiry!
		$recentBookings: AllBookingsInquiry!
		$articles: AllBoardArticlesInquiry!
		$inquiries: AllNoticesInquiry!
		$recentMembers: MembersInquiry!
	) {
		members: getAllMembersByAdmin(input: $members) {
			metaCounter {
				total
			}
		}
		agents: getAllMembersByAdmin(input: $agents) {
			metaCounter {
				total
			}
		}
		tours: getAllToursByAdmin(input: $tours) {
			metaCounter {
				total
			}
		}
		hotels: getAllHotelsByAdmin(input: $hotels) {
			metaCounter {
				total
			}
		}
		rentcars: getAllRentcarsByAdmin(input: $rentcars) {
			metaCounter {
				total
			}
		}
		flights: getAllFlightsByAdmin(input: $flights) {
			metaCounter {
				total
			}
		}
		pendingBookings: getAllBookingsByAdmin(input: $pendingBookings) {
			metaCounter {
				total
			}
		}
		recentBookings: getAllBookingsByAdmin(input: $recentBookings) {
			list {
				_id
				bookingType
				bookingStatus
				bookingTitle
				bookingPrice
				createdAt
				memberData {
					_id
					memberNick
					memberFullName
					memberImage
				}
			}
			metaCounter {
				total
			}
		}
		articles: getAllBoardArticlesByAdmin(input: $articles) {
			metaCounter {
				total
			}
		}
		inquiries: getAllNoticesByAdmin(input: $inquiries) {
			metaCounter {
				total
			}
		}
		recentMembers: getAllMembersByAdmin(input: $recentMembers) {
			list {
				_id
				memberNick
				memberFullName
				memberImage
				memberType
				createdAt
			}
		}
	}
`;
