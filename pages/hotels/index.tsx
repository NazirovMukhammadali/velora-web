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

const HotelsPage: NextPage = () => {
	return (
		<Stack className={'agent-list-page'}>
			<Stack className={'container'} sx={{ py: 8, gap: 2 }}>
				<Typography variant="h4">Hotels</Typography>
				<Typography>
					This is the new hotels tab skeleton. API integration for hotel listings will be added after backend demo flow is stable.
				</Typography>
				<Link href="/" passHref legacyBehavior>
					<Button variant="contained">Back to home</Button>
				</Link>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(HotelsPage);
