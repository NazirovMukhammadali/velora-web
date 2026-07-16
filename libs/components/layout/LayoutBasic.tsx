import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import VeloraNavbar from './VeloraNavbar';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import Chat from '../Chat';
import ErrorBoundary from '../common/ErrorBoundary';
import SeoHead from '../common/SeoHead';
import { getRouteSeo } from '../../config/seo';
import { AGENT_HEADER_BG, AGENT_HEADER_OVERLAY } from '../../data/agentPage';
import { useTranslation } from 'next-i18next';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const { t } = useTranslation('common');
		useAuth({ syncOnMount: true });

		const authPaths = ['/account/join', '/login', '/register'];
		const hideHeroBanner = authPaths.includes(router.pathname);
		const hideNavbar = hideHeroBanner;
		const hideFooter = hideHeroBanner;
		const seo = getRouteSeo(router.pathname);
		const isAgentHeader = router.pathname === '/agent' || router.pathname === '/agent/detail';

		const memoizedValues = useMemo(() => {
			let title = '',
				desc = '',
				bgImage = '';

			switch (router.pathname) {
				case '/about':
					title = 'About';
					desc = 'Learn more about Velora';
					bgImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80';
					break;
				case '/flights':
					title = 'Flights';
					desc = 'Search and compare flight options';
					bgImage = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80';
					break;
				case '/hotels':
					title = 'Hotels';
					desc = 'Browse hotel options for your trip';
					bgImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80';
					break;
				case '/rentcar':
					title = 'Rentcar';
					desc = 'Find rental cars for your schedule';
					bgImage = 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80';
					break;
				case '/tours':
					title = 'Tours';
					desc = 'Explore curated tour packages';
					bgImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80';
					break;
				case '/package/detail':
					title = 'Package details';
					desc = 'Full itinerary, reviews, and booking';
					bgImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80';
					break;
				case '/bookings':
					title = 'My Bookings';
					desc = 'Track your tour booking statuses';
					bgImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80';
					break;
				case '/agent':
					title = 'Agents';
					desc = 'Meet certified travel experts';
					bgImage = AGENT_HEADER_BG;
					break;
				case '/agent/detail':
					title = 'Agent Page';
					desc = 'Travel expert profile';
					bgImage = AGENT_HEADER_BG;
					break;
				case '/mypage':
					title = 'my page';
					desc = 'Your trips at a glance';
					bgImage = 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=1600&q=80';
					break;
				case '/community':
					title = 'Community';
					desc = 'Stories from fellow travelers';
					bgImage = 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=1600&q=80';
					break;
				case '/community/detail':
					title = 'Community Detail';
					desc = 'Stories from fellow travelers';
					bgImage = 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=1600&q=80';
					break;
				case '/cs':
					title = 'CS';
					desc = 'We are glad to see you again!';
					bgImage = 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80';
					break;
				case '/account/join':
					title = 'Sign in';
					desc = 'Access your Velora account';
					bgImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80';
					break;
				case '/login':
					title = 'Sign in';
					desc = 'Access your Velora account';
					bgImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80';
					break;
				case '/register':
					title = 'Create account';
					desc = 'Join Velora to plan and book smarter';
					bgImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80';
					break;
				case '/member':
					title = 'Member Page';
					desc = 'Member profile';
					bgImage = 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=1600&q=80';
					break;
				default:
					break;
			}

			return { title, desc, bgImage };
		}, [router.pathname]);

		return (
			<>
				<SeoHead title={seo.title} description={seo.description} />
				<Stack id="pc-wrap" className={hideNavbar ? 'pc-wrap--auth' : undefined}>
					{!hideNavbar && (
						<Stack id={'top'}>
							<VeloraNavbar contrast />
						</Stack>
					)}

					{!hideHeroBanner && memoizedValues.bgImage && (
						<Stack
							className={`header-basic${isAgentHeader ? ' header-basic--agents' : ''}`}
							style={{
								backgroundImage: `url(${memoizedValues.bgImage})`,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
								boxShadow: isAgentHeader ? AGENT_HEADER_OVERLAY : 'inset 10px 40px 150px 40px rgb(24 22 36)',
							}}
						>
							<Stack className={'container'}>
								<strong>{t(memoizedValues.title)}</strong>
								<span>{t(memoizedValues.desc)}</span>
							</Stack>
						</Stack>
					)}

					<Stack id={'main'}>
						<ErrorBoundary>
							<Component {...props} />
						</ErrorBoundary>
					</Stack>

					{!hideNavbar && <Chat />}

					{!hideFooter && (
						<Stack id={'footer'}>
							<Footer />
						</Stack>
					)}
				</Stack>
			</>
		);
	};
};

export default withLayoutBasic;
