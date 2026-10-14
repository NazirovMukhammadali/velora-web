import type { ComponentType } from 'react';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Avatar, CircularProgress, Divider, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { ArrowSquareOut, List as ListIcon, SignOut, X } from 'phosphor-react';
import AdminMenuList from '../admin/AdminMenuList';
import { findAdminNavItem } from '../admin/adminNav';
import { veloraAdminTheme } from '../admin/adminTheme';
import ErrorBoundary from '../common/ErrorBoundary';
import { getJwtToken, logOut } from '../../auth';
import useAuth from '../../hooks/useAuth';
import { MemberType } from '../../enums/member.enum';
import { resolveMemberImageUrl } from '../../utils/memberImage';

const withAdminLayout = (Component: ComponentType) => {
	const AdminLayout = (props: object) => {
		const router = useRouter();
		const { user, authReady } = useAuth({ syncOnMount: true });
		const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);
		const [sidebarOpen, setSidebarOpen] = useState(false);
		const isAdmin = user?.memberType === MemberType.ADMIN;
		const current = findAdminNavItem(router.pathname);

		/** LIFECYCLES **/
		useEffect(() => {
			if (!authReady || !router.isReady) return;
			if (!getJwtToken() || !user?._id) {
				void router.replace(`/login?referrer=${encodeURIComponent(router.asPath)}`);
			} else if (!isAdmin) {
				void router.replace('/');
			}
		}, [authReady, router, user?._id, isAdmin]);

		// Close the mobile drawer after navigating.
		useEffect(() => {
			setSidebarOpen(false);
		}, [router.pathname]);

		/** HANDLERS **/
		const logoutHandler = () => {
			setUserAnchor(null);
			logOut();
			void router.push('/');
		};

		const pageTitle = `${current?.label ?? 'Admin'} · Velora Admin`;

		if (!authReady || !isAdmin) {
			return (
				<div className="va-gate">
					<Head>
						<title>Velora Admin</title>
					</Head>
					<CircularProgress size={28} />
				</div>
			);
		}

		return (
			<ThemeProvider theme={veloraAdminTheme}>
				<Head>
					<title>{pageTitle}</title>
				</Head>
				<div id="pc-wrap" className={`velora-admin ${sidebarOpen ? 'is-sidebar-open' : ''}`}>
					<aside className="va-sidebar">
						<div className="va-sidebar__head">
							<Link href="/_admin" className="va-brand" aria-label="Velora admin home">
								<Image src="/img/logo/velora-mark.svg" alt="" aria-hidden width={34} height={34} priority />
								<span className="va-brand__name">VELORA</span>
								<span className="va-brand__tag">Admin</span>
							</Link>
							<IconButton className="va-sidebar__close" aria-label="Close menu" onClick={() => setSidebarOpen(false)}>
								<X size={20} />
							</IconButton>
						</div>

						<AdminMenuList onNavigate={() => setSidebarOpen(false)} />

						<div className="va-sidebar__foot">
							<Link href="/" className="va-sidebar__site" target="_blank" rel="noopener noreferrer">
								<ArrowSquareOut size={18} />
								<span>Open website</span>
							</Link>
						</div>
					</aside>
					<button
						type="button"
						className="va-scrim"
						aria-label="Close menu"
						tabIndex={sidebarOpen ? 0 : -1}
						onClick={() => setSidebarOpen(false)}
					/>

					<div className="va-main">
						<header className="va-topbar">
							<IconButton className="va-topbar__burger" aria-label="Open menu" onClick={() => setSidebarOpen(true)}>
								<ListIcon size={22} />
							</IconButton>
							<div className="va-topbar__title">
								<h1>{current?.label ?? 'Admin'}</h1>
								{current?.hint && <p>{current.hint}</p>}
							</div>
							<Tooltip title="Account">
								<button type="button" className="va-topbar__user" onClick={(e) => setUserAnchor(e.currentTarget)}>
									<Avatar
										src={resolveMemberImageUrl(user.memberImage)}
										alt={user.memberNick}
										sx={{ width: 36, height: 36 }}
									/>
									<span className="va-topbar__user-text">
										<strong>{user.memberFullName || user.memberNick}</strong>
										<small>Administrator</small>
									</span>
								</button>
							</Tooltip>
							<Menu
								anchorEl={userAnchor}
								open={Boolean(userAnchor)}
								onClose={() => setUserAnchor(null)}
								anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
								transformOrigin={{ vertical: 'top', horizontal: 'right' }}
								slotProps={{ paper: { className: 'va-user-menu' } }}
							>
								<div className="va-user-menu__head">
									<strong>{user.memberNick}</strong>
									{user.memberPhone && <small>{user.memberPhone}</small>}
								</div>
								<Divider />
								<MenuItem component={Link} href="/" onClick={() => setUserAnchor(null)}>
									<ArrowSquareOut size={18} /> Back to website
								</MenuItem>
								<MenuItem onClick={logoutHandler}>
									<SignOut size={18} /> Log out
								</MenuItem>
							</Menu>
						</header>

						<main className="va-content">
							<ErrorBoundary>
								<Component {...props} />
							</ErrorBoundary>
						</main>
					</div>
				</div>
			</ThemeProvider>
		);
	};

	return AdminLayout;
};

export default withAdminLayout;
