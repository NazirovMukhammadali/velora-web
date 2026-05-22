import React, { useEffect } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import VeloraNavbar from './VeloraNavbar';
import HeaderFilter from '../homepage/HeaderFilter';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutMain = (Component: any) => {
	return (props: any) => {
		const device = useDeviceDetect();

		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		const wrapId = device === 'mobile' ? 'mobile-wrap' : 'pc-wrap';

		return (
			<>
				<Head>
					<title>Velora</title>
					<meta name={'title'} content={'Velora'} />
				</Head>
				<Stack id={wrapId}>
					<Stack id={'top'}>
						<VeloraNavbar overlay />
					</Stack>
					<Stack className={'header-main header-main--immersive'}>
						<HeaderFilter />
					</Stack>

					<Stack id={'main'} className={'main-after-hero'}>
						<Component {...props} />
					</Stack>

					{device !== 'mobile' && <Chat />}

					<Stack id={'footer'}>
						<Footer />
					</Stack>
				</Stack>
			</>
		);
	};
};

export default withLayoutMain;
