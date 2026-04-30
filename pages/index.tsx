import { NextPage } from 'next';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import TourPackages from '../libs/components/homepage/TourPackages';
import TravelExperts from '../libs/components/homepage/TravelExperts';
import PopularDestinations from '../libs/components/homepage/PopularDestinations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => (
	<Stack className={'home-page'}>
		<TourPackages />
		<TravelExperts />
		<PopularDestinations />
	</Stack>
);

export default withLayoutMain(Home);
