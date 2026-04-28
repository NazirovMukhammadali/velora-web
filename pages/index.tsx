import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import TourPackages from '../libs/components/homepage/TourPackages';
import TravelExperts from '../libs/components/homepage/TravelExperts';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<TourPackages />
				<TravelExperts />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<TourPackages />
				<TravelExperts />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
