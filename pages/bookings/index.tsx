import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { useRequireAuth } from '../../libs/hooks/useAuth';
import { GET_MY_HOTEL_BOOKINGS, GET_MY_TOUR_BOOKINGS } from '../../apollo/user/query';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { formatPackagePrice } from '../../libs/data/packages';
import { formatDate } from '../../libs/utils/date';
import { getLocalBookings } from '../../libs/utils/bookingsStorage';
import type { StoredBooking } from '../../libs/types/package';

type ApiBooking = {
	_id: string;
	bookingTitle: string;
	bookingStatus: string;
	bookingPrice: number;
	checkInDate?: string;
	checkOutDate?: string;
	quantity?: number;
};

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const BookingsPage: NextPage = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const { isAuthorized } = useRequireAuth();
	const [localBookings, setLocalBookings] = useState<StoredBooking[]>([]);

	const inquiry = {
		page: 1,
		limit: 20,
		sort: 'createdAt',
		direction: 'DESC',
	};

	const { data: tourData, error: tourError } = useQuery(GET_MY_TOUR_BOOKINGS, {
		fetchPolicy: 'network-only',
		skip: !isAuthorized,
		variables: { input: inquiry },
	});

	const { data: hotelData, error: hotelError } = useQuery(GET_MY_HOTEL_BOOKINGS, {
		fetchPolicy: 'network-only',
		skip: !isAuthorized,
		variables: { input: inquiry },
	});

	useEffect(() => {
		if (!isAuthorized) return;
		const all = getLocalBookings();
		setLocalBookings(all.filter((b) => b.packageType !== 'hotels'));
	}, [router.query.booked, isAuthorized]);

	const tourBookings: ApiBooking[] = tourData?.getMyTourBookings?.list ?? [];
	const hotelBookings: ApiBooking[] = hotelData?.getMyHotelBookings?.list ?? [];
	const showSuccess = router.query.booked === '1';
	const bookedHotel = router.query.type === 'hotel';

	if (!isAuthorized) {
		return null;
	}

	return (
		<Stack className={'agent-list-page'}>
			<Stack className={'container'} sx={{ py: 6, gap: 2, maxWidth: 900 }}>
				<Typography variant="h4">{t('My Bookings')}</Typography>

				{showSuccess && (
					<div className="velora-booking-success">
						<Typography component="p" fontWeight={700}>
							{bookedHotel ? t('Stay request received') : t('Booking confirmed')}
						</Typography>
					</div>
				)}

				{localBookings.length > 0 && (
					<>
						<Typography variant="h6" sx={{ mt: 2 }}>
							Recent Velora bookings
						</Typography>
						{localBookings.map((booking) => (
							<div key={booking.id} className="velora-booking-card">
								<img src={booking.image} alt="" width={96} height={72} />
								<div>
									<Typography fontWeight={700}>{booking.title}</Typography>
									<Typography variant="body2">{booking.location}</Typography>
									<Typography variant="body2">
										{booking.date} · {booking.time} · {booking.adults} adult
										{booking.adults !== 1 ? 's' : ''}
									</Typography>
									<Typography variant="body2" className="velora-booking-price">
										{formatPackagePrice(booking.total)} · {booking.status}
									</Typography>
								</div>
							</div>
						))}
					</>
				)}

				{(tourError || hotelError) && (
					<Typography color="text.secondary">
						Unable to load some server bookings right now. Package bookings stored on this device still appear
						above.
					</Typography>
				)}

				{!hotelError && hotelBookings.length > 0 && (
					<>
						<Typography variant="h6" sx={{ mt: 2 }}>
							{t('Hotel stays')}
						</Typography>
						{hotelBookings.map((booking) => (
							<div key={booking._id} className="velora-booking-card velora-booking-card--api">
								<Typography fontWeight={700}>{booking.bookingTitle}</Typography>
								<Typography variant="body2">
									{t('Status')}: {booking.bookingStatus}
								</Typography>
								<Typography variant="body2">
									{formatDate(booking.checkInDate, 'dd.MM.yyyy')} →{' '}
									{formatDate(booking.checkOutDate, 'dd.MM.yyyy')} · {booking.quantity ?? 1} room
									{(booking.quantity ?? 1) !== 1 ? 's' : ''}
								</Typography>
								<Typography variant="body2">
									{t('Price')}: ${booking.bookingPrice}
								</Typography>
							</div>
						))}
					</>
				)}

				{!tourError && tourBookings.length > 0 && (
					<>
						<Typography variant="h6" sx={{ mt: 2 }}>
							{t('Agent tour bookings')}
						</Typography>
						{tourBookings.map((booking) => (
							<div key={booking._id} className="velora-booking-card velora-booking-card--api">
								<Typography fontWeight={700}>{booking.bookingTitle}</Typography>
								<Typography variant="body2">
									{t('Status')}: {booking.bookingStatus}
								</Typography>
								<Typography variant="body2">
									{t('Price')}: ${booking.bookingPrice}
								</Typography>
							</div>
						))}
					</>
				)}

				{localBookings.length === 0 &&
					!tourError &&
					!hotelError &&
					tourBookings.length === 0 &&
					hotelBookings.length === 0 && (
						<Typography>
							{t('No bookings yet')}{' '}
							<Link href="/hotels" style={{ color: '#5b3df5', fontWeight: 600 }}>
								{t('Browse hotels')}
							</Link>
							.
						</Typography>
					)}
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(BookingsPage);
