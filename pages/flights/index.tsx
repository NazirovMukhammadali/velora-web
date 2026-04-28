import { NextPage } from 'next';
import { useQuery } from '@apollo/client';
import { Stack, Typography, Button } from '@mui/material';
import Link from 'next/link';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GET_FLIGHTS } from '../../apollo/user/query';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const FlightsPage: NextPage = () => {
	const { data, error } = useQuery(GET_FLIGHTS, {
		fetchPolicy: 'network-only',
		variables: {
			input: { page: 1, limit: 12, sort: 'createdAt', direction: 'DESC' },
		},
	});
	const flights = data?.getFlights?.list ?? [];

	return (
		<Stack className={'agent-list-page'}>
			<Stack className={'container'} sx={{ py: 8, gap: 2 }}>
				<Typography variant="h4">Flights</Typography>
				{error && <Typography color="error">Failed to load flights.</Typography>}
				{!error && flights.length === 0 && <Typography>No flights found.</Typography>}
				{flights.map((flight: any) => (
					<div key={flight._id} style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px' }}>
						<Typography sx={{ fontWeight: 700 }}>
							{flight.airline} ({flight.flightNumber})
						</Typography>
						<Typography variant="body2">
							{flight.departureAirport} - {flight.arrivalAirport}
						</Typography>
						<Typography variant="body2">From ${flight.basePrice}</Typography>
					</div>
				))}
				<Link href="/" passHref legacyBehavior>
					<Button variant="contained">Back to home</Button>
				</Link>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(FlightsPage);
