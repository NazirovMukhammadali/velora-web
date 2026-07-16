import React from 'react';
import VeloraNavbar from './VeloraNavbar';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import Chat from '../Chat';
import ErrorBoundary from '../common/ErrorBoundary';
import SeoHead from '../common/SeoHead';
import { DEFAULT_SEO } from '../../config/seo';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutFull = (Component: any) => {
	return (props: any) => {
		useAuth({ syncOnMount: true });

		return (
			<>
				<SeoHead title={DEFAULT_SEO.title} description={DEFAULT_SEO.description} rawTitle />
				<Stack id="pc-wrap">
					<Stack id={'top'}>
						<VeloraNavbar contrast />
					</Stack>

					<Stack id={'main'}>
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

export default withLayoutFull;
