import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_AGENTS = gql`
	query GetAgents($input: AgentsInquiry!) {
		getAgents(input: $input) {
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
				memberPoints
				memberLikes
				memberViews
				deletedAt
				createdAt
				updatedAt
				accessToken
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER = gql(`
query GetMember($input: String!) {
    getMember(memberId: $input) {
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
        memberArticles
        memberPoints
        memberLikes
        memberViews
        memberFollowings
				memberFollowers
        memberRank
        memberWarnings
        memberBlocks
        deletedAt
        createdAt
        updatedAt
        accessToken
        meFollowed {
					followingId
					followerId
					myFollowing
				}
    }
}
`);

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const GET_BOARD_ARTICLE = gql`
	query GetBoardArticle($input: String!) {
		getBoardArticle(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			articleComments
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
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

export const GET_BOARD_ARTICLES = gql`
	query GetBoardArticles($input: BoardArticlesInquiry!) {
		getBoardArticles(input: $input) {
			list {
				_id
				articleCategory
				articleStatus
				articleTitle
				articleContent
				articleImage
				articleViews
				articleLikes
				articleComments
				memberId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
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

export const GET_COMMENTS = gql`
	query GetComments($input: CommentsInquiry!) {
		getComments(input: $input) {
			list {
				_id
				commentStatus
				commentGroup
				commentContent
				commentRefId
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
 *         FOLLOW        *
 *************************/
export const GET_MEMBER_FOLLOWERS = gql`
	query GetMemberFollowers($input: FollowInquiry!) {
		getMemberFollowers(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
				followerData {
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
					memberArticles
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberFollowings
					memberFollowers
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER_FOLLOWINGS = gql`
	query GetMemberFollowings($input: FollowInquiry!) {
		getMemberFollowings(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				followingData {
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
					memberArticles
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberFollowings
					memberFollowers
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *          TOUR          *
 *************************/

export const GET_AGENT_TOURS = gql`
	query GetAgentTours($agentId: String!, $input: AgentToursInquiry!) {
		getAgentTours(agentId: $agentId, input: $input) {
			list {
				_id
				tourTitle
				tourLocation
				tourDays
				tourNights
				tourPrice
				tourImages
				tourDesc
				tourLikes
				tourViews
				tourSoldCount
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_TOURS = gql`
	query GetTours($input: ToursInquiry!) {
		getTours(input: $input) {
			list {
				_id
				tourTitle
				tourLocation
				tourDays
				tourNights
				tourPrice
				tourImages
				tourStatus
				tourSoldCount
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_TOUR_DETAIL = gql`
	query GetTourDetail($tourId: ID!) {
		getTourDetail(tourId: $tourId) {
			_id
			tourTitle
			tourLocation
			tourDays
			tourNights
			tourPrice
			tourImages
			tourDesc
			tourStatus
			tourSoldCount
			memberId
		}
	}
`;

/**************************
 *       DISCOVERY        *
 *************************/

export const GET_FLIGHTS = gql`
	query GetFlights($input: FlightsInquiry!) {
		getFlights(input: $input) {
			list {
				_id
				airline
				flightNumber
				departureAirport
				arrivalAirport
				basePrice
				flightStatus
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_FLIGHT_DETAIL = gql`
	query GetFlightDetail($flightId: ID!) {
		getFlightDetail(flightId: $flightId) {
			_id
			airline
			flightNumber
			departureAirport
			arrivalAirport
			departureTime
			arrivalTime
			basePrice
			flightStatus
		}
	}
`;

export const GET_HOTELS = gql`
	query GetHotels($input: HotelsInquiry!) {
		getHotels(input: $input) {
			list {
				_id
				hotelName
				hotelLocation
				hotelPrice
				hotelStars
				hotelStatus
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_HOTEL_DETAIL = gql`
	query GetHotelDetail($hotelId: ID!) {
		getHotelDetail(hotelId: $hotelId) {
			_id
			hotelName
			hotelLocation
			hotelAddress
			hotelPrice
			hotelStars
			hotelImages
			hotelDesc
			hotelStatus
		}
	}
`;

export const GET_RENTCARS = gql`
	query GetRentcars($input: RentcarsInquiry!) {
		getRentcars(input: $input) {
			list {
				_id
				carTitle
				carLocation
				carCategory
				transmission
				seats
				dailyPrice
				rentcarStatus
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_RENTCAR_DETAIL = gql`
	query GetRentcarDetail($rentcarId: ID!) {
		getRentcarDetail(rentcarId: $rentcarId) {
			_id
			carTitle
			carLocation
			carCategory
			transmission
			seats
			dailyPrice
			carImages
			carDesc
			rentcarStatus
		}
	}
`;

/**************************
 *        BOOKING         *
 *************************/

export const GET_MY_TOUR_BOOKINGS = gql`
	query GetMyTourBookings($input: BookingInquiry!) {
		getMyTourBookings(input: $input) {
			list {
				_id
				bookingType
				bookingStatus
				bookingRefId
				bookingTitle
				bookingPrice
				agentId
				memberId
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;
