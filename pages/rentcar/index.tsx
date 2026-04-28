import { NextPage } from 'next';
import { Stack, Typography, Button } from '@mui/material';
import Link from 'next/link';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const RentcarPage: NextPage = () => {
	return (
		<Stack className={'agent-list-page'}>
			<Stack className={'container'} sx={{ py: 8, gap: 2 }}>
				<Typography variant="h4">Rentcar</Typography>
				<Typography>
					This is the new rentcar tab skeleton. Car inventory and availability integration is planned in a dedicated phase.
				</Typography>
				<Link href="/" passHref legacyBehavior>
					<Button variant="contained">Back to home</Button>
				</Link>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(RentcarPage);
