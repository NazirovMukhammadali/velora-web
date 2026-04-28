import { NextPage } from 'next';
import { useQuery } from '@apollo/client';
import { Stack, Typography, Button } from '@mui/material';
import Link from 'next/link';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GET_HOTELS } from '../../apollo/user/query';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const HotelsPage: NextPage = () => {
	const { data, error } = useQuery(GET_HOTELS, {
		fetchPolicy: 'network-only',
		variables: {
			input: { page: 1, limit: 12, sort: 'createdAt', direction: 'DESC' },
		},
	});
	const hotels = data?.getHotels?.list ?? [];

	return (
		<Stack className={'agent-list-page'}>
			<Stack className={'container'} sx={{ py: 8, gap: 2 }}>
				<Typography variant="h4">Hotels</Typography>
				{error && <Typography color="error">Failed to load hotels.</Typography>}
				{!error && hotels.length === 0 && <Typography>No hotels found.</Typography>}
				{hotels.map((hotel: any) => (
					<div key={hotel._id} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px' }}>
						<Typography sx={{ fontWeight: 700 }}>{hotel.hotelName}</Typography>
						<Typography variant="body2">{hotel.hotelLocation}</Typography>
						<Typography variant="body2">
							${hotel.hotelPrice} | {hotel.hotelStars} stars
						</Typography>
					</div>
				))}
				<Link href="/" passHref legacyBehavior>
					<Button variant="contained">Back to home</Button>
				</Link>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(HotelsPage);
