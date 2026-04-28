import { NextPage } from 'next';
import { useQuery } from '@apollo/client';
import { Box, Stack, Typography } from '@mui/material';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { GET_MY_TOUR_BOOKINGS } from '../../apollo/user/query';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const BookingsPage: NextPage = () => {
	const { data, error } = useQuery(GET_MY_TOUR_BOOKINGS, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				page: 1,
				limit: 20,
				sort: 'createdAt',
				direction: 'DESC',
			},
		},
	});

	const bookings = data?.getMyTourBookings?.list ?? [];

	return (
		<Stack className={'agent-list-page'}>
			<Stack className={'container'} sx={{ py: 6, gap: 2 }}>
				<Typography variant="h4">My Bookings</Typography>
				{error && (
					<Typography color="error">
						Please log in to view your bookings.
					</Typography>
				)}

				{!error && bookings.length === 0 && (
					<Typography>No bookings yet. Start from an agent tour package and create your first booking.</Typography>
				)}

				{bookings.map((booking: any) => (
					<Box
						key={booking._id}
						sx={{
							border: '1px solid #e5e7eb',
							borderRadius: '12px',
							padding: '14px',
							backgroundColor: '#fff',
						}}
					>
						<Typography sx={{ fontWeight: 700 }}>{booking.bookingTitle}</Typography>
						<Typography variant="body2">Status: {booking.bookingStatus}</Typography>
						<Typography variant="body2">Price: ${booking.bookingPrice}</Typography>
					</Box>
				))}
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(BookingsPage);
