import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { Stack, Typography } from '@mui/material';
import Link from 'next/link';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { useRequireAuth } from '../../libs/hooks/useAuth';
import { GET_MY_TOUR_BOOKINGS } from '../../apollo/user/query';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { formatPackagePrice } from '../../libs/data/packages';
import { getLocalBookings } from '../../libs/utils/bookingsStorage';
import type { StoredBooking } from '../../libs/types/package';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const BookingsPage: NextPage = () => {
	const router = useRouter();
	const { isAuthorized } = useRequireAuth();
	const [localBookings, setLocalBookings] = useState<StoredBooking[]>([]);

	const { data, error } = useQuery(GET_MY_TOUR_BOOKINGS, {
		fetchPolicy: 'network-only',
		skip: !isAuthorized,
		variables: {
			input: {
				page: 1,
				limit: 20,
				sort: 'createdAt',
				direction: 'DESC',
			},
		},
	});

	useEffect(() => {
		if (!isAuthorized) return;
		setLocalBookings(getLocalBookings());
	}, [router.query.booked, isAuthorized]);

	const apiBookings = data?.getMyTourBookings?.list ?? [];
	const showSuccess = router.query.booked === '1';

	if (!isAuthorized) {
		return null;
	}

	return (
		<Stack className={'agent-list-page'}>
			<Stack className={'container'} sx={{ py: 6, gap: 2, maxWidth: 900 }}>
				<Typography variant="h4">My Bookings</Typography>

				{showSuccess && (
					<div className="velora-booking-success">
						<Typography component="p" fontWeight={700}>
							Booking confirmed! Your reservation is saved below.
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

				{error && (
					<Typography color="text.secondary">
						Unable to load agent tour bookings from the server right now. Your Velora package bookings
						above are stored on this device.
					</Typography>
				)}

				{!error && apiBookings.length > 0 && (
					<>
						<Typography variant="h6" sx={{ mt: 2 }}>
							Agent tour bookings
						</Typography>
						{apiBookings.map((booking: any) => (
							<div key={booking._id} className="velora-booking-card velora-booking-card--api">
								<Typography fontWeight={700}>{booking.bookingTitle}</Typography>
								<Typography variant="body2">Status: {booking.bookingStatus}</Typography>
								<Typography variant="body2">Price: ${booking.bookingPrice}</Typography>
							</div>
						))}
					</>
				)}

				{localBookings.length === 0 && !error && apiBookings.length === 0 && (
					<Typography>
						No bookings yet.{' '}
						<Link href="/" style={{ color: '#5b3df5', fontWeight: 600 }}>
							Browse packages
						</Link>{' '}
						and use Book Now on any tour, hotel, car, or flight.
					</Typography>
				)}
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(BookingsPage);
