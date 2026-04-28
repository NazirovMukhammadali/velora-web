import { NextPage } from 'next';
import { useQuery } from '@apollo/client';
import { Stack, Typography, Button } from '@mui/material';
import Link from 'next/link';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GET_RENTCARS } from '../../apollo/user/query';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const RentcarPage: NextPage = () => {
	const { data, error } = useQuery(GET_RENTCARS, {
		fetchPolicy: 'network-only',
		variables: {
			input: { page: 1, limit: 12, sort: 'createdAt', direction: 'DESC' },
		},
	});
	const rentcars = data?.getRentcars?.list ?? [];

	return (
		<Stack className={'agent-list-page'}>
			<Stack className={'container'} sx={{ py: 8, gap: 2 }}>
				<Typography variant="h4">Rentcar</Typography>
				{error && <Typography color="error">Failed to load rentcars.</Typography>}
				{!error && rentcars.length === 0 && <Typography>No rentcars found.</Typography>}
				{rentcars.map((car: any) => (
					<div key={car._id} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px' }}>
						<Typography sx={{ fontWeight: 700 }}>{car.carTitle}</Typography>
						<Typography variant="body2">{car.carLocation}</Typography>
						<Typography variant="body2">
							${car.dailyPrice} / day | {car.seats} seats
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

export default withLayoutBasic(RentcarPage);
