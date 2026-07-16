import React from 'react';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import VeloraNavbar from './VeloraNavbar';
import HeaderFilter from '../homepage/HeaderFilter';
import useAuth from '../../hooks/useAuth';
import Chat from '../Chat';
import ErrorBoundary from '../common/ErrorBoundary';
import SeoHead from '../common/SeoHead';
import { getRouteSeo } from '../../config/seo';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutMain = (Component: any) => {
	return (props: any) => {
		useAuth({ syncOnMount: true });
		const seo = getRouteSeo('/');

		return (
			<>
				<SeoHead title={seo.title} description={seo.description} rawTitle />
				<Stack id="pc-wrap">
					<Stack id={'top'}>
						<VeloraNavbar overlay />
					</Stack>
					<Stack className={'header-main header-main--immersive'}>
						<HeaderFilter />
					</Stack>

					<Stack id={'main'} className={'main-after-hero'}>
						<ErrorBoundary>
							<Component {...props} />
						</ErrorBoundary>
					</Stack>

					<Chat />

					<Stack id={'footer'}>
						<Footer />
					</Stack>
				</Stack>
			</>
		);
	};
};

export default withLayoutMain;
