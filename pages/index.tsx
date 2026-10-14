import { NextPage } from 'next';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import TourPackages from '../libs/components/homepage/TourPackages';
import TravelShowcaseVideo from '../libs/components/homepage/TravelShowcaseVideo';
import TravelExperts from '../libs/components/homepage/TravelExperts';
import PopularDestinations from '../libs/components/homepage/PopularDestinations';
import LatestNews from '../libs/components/homepage/LatestNews';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

/** Browse first (packages, destinations), then inspiration, trust (experts) and fresh content. */
const Home: NextPage = () => (
	<Stack className={'home-page'}>
		<TourPackages />
		<PopularDestinations />
		<TravelShowcaseVideo />
		<TravelExperts />
		<LatestNews />
	</Stack>
);

export default withLayoutMain(Home);
