import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import { styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Logout } from '@mui/icons-material';
import { CaretDown } from 'phosphor-react';
import { userVar } from '../../../apollo/store';
import { getJwtToken, logOut, updateUserInfo } from '../../auth';
import { REACT_APP_API_URL } from '../../config';

type VeloraNavbarProps = {
	overlay?: boolean;
	contrast?: boolean;
};

type NavItem = {
	href: string;
	labelKey: 'Home' | 'Tours' | 'Agents' | 'Community' | 'CS';
	isActive: (pathname: string) => boolean;
};

const NAV_ITEMS: NavItem[] = [
	{ href: '/', labelKey: 'Home', isActive: (p) => p === '/' },
	{ href: '/tours', labelKey: 'Tours', isActive: (p) => p === '/tours' || p.startsWith('/tours/') },
	{ href: '/agent', labelKey: 'Agents', isActive: (p) => p === '/agent' || p.startsWith('/agent/') },
	{
		href: '/community?articleCategory=FREE',
		labelKey: 'Community',
		isActive: (p) => p === '/community' || p.startsWith('/community/'),
	},
	{ href: '/cs', labelKey: 'CS', isActive: (p) => p === '/cs' || p.startsWith('/cs/') },
];

const LANG_FLAGS: Record<string, string> = {
	en: 'langen',
	kr: 'langkr',
	ru: 'langru',
};

const LangMenu = styled((props: MenuProps) => (
	<Menu
		elevation={0}
		className="velora-lang-menu"
		anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
		transformOrigin={{ vertical: 'top', horizontal: 'right' }}
		{...props}
	/>
))(({ theme }) => ({
	'& .MuiPaper-root': {
		borderRadius: 8,
		marginTop: theme.spacing(1),
		minWidth: 180,
		padding: '4px 0',
		boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
	},
	'& .MuiMenuItem-root': {
		display: 'flex',
		alignItems: 'center',
		gap: theme.spacing(1.25),
		minHeight: 44,
		fontFamily: "'Poppins', sans-serif",
		fontSize: 14,
	},
	'& .MuiMenuItem-root img': {
		width: 24,
		height: 17,
		maxWidth: 24,
		flexShrink: 0,
		objectFit: 'cover',
		borderRadius: 2,
	},
}));

const VeloraNavbar = ({ overlay = false, contrast = false }: VeloraNavbarProps) => {
	const user = useReactiveVar(userVar);
	const { t } = useTranslation('common');
	const router = useRouter();
	const [lang, setLang] = useState('en');
	const [menuOpen, setMenuOpen] = useState(false);
	const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
	const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const stored = localStorage.getItem('locale');
		if (stored) {
			setLang(stored);
		} else {
			localStorage.setItem('locale', 'en');
			setLang('en');
		}
	}, [router]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 16);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	useEffect(() => {
		if (!menuOpen) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = prev;
		};
	}, [menuOpen]);

	const langChoice = useCallback(
		async (locale: string) => {
			setLang(locale);
			localStorage.setItem('locale', locale);
			setLangAnchor(null);
			await router.push(router.asPath, router.asPath, { locale });
		},
		[router],
	);

	const navClass = [
		'velora-navbar',
		overlay ? 'velora-navbar--overlay' : '',
		contrast ? 'velora-navbar--contrast' : '',
		scrolled ? 'velora-navbar--scrolled' : '',
	]
		.filter(Boolean)
		.join(' ');

	const flagFile = LANG_FLAGS[lang] ?? 'langen';
	const flagSrc = `/img/flag/${flagFile}.png`;

	const labelFor = (key: NavItem['labelKey']) => (key === 'Tours' ? 'Tours' : t(key));

	return (
		<>
			<div
				className={`velora-nav-drawer-overlay ${menuOpen ? 'open' : ''}`}
				onClick={() => setMenuOpen(false)}
				aria-hidden={!menuOpen}
			/>
			<aside className={`velora-nav-drawer ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
				<div className="velora-nav-drawer-head">
					<span>Menu</span>
					<button
						type="button"
						className="velora-nav-drawer-close"
						onClick={() => setMenuOpen(false)}
						aria-label="Close menu"
					>
						×
					</button>
				</div>
				<nav className="velora-nav-drawer-links">
					{NAV_ITEMS.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={item.isActive(router.pathname) ? 'active' : ''}
							onClick={() => setMenuOpen(false)}
						>
							{labelFor(item.labelKey)}
						</Link>
					))}
				</nav>
			</aside>

			<header className={navClass}>
				<div className="velora-navbar-shell">
					<div className="velora-navbar-left">
						<button
							type="button"
							className="velora-navbar-menu-btn"
							onClick={() => setMenuOpen(true)}
							aria-label="Open menu"
							aria-expanded={menuOpen}
						>
							<span />
							<span />
							<span />
						</button>
						<Link href="/" className="velora-navbar-brand" aria-label="Velora home">
							<img className="velora-navbar-brand-mark" src="/img/logo/velora-mark.svg" alt="" aria-hidden />
							<span className="velora-navbar-brand-name">VELORA</span>
						</Link>
					</div>

					<nav className="velora-navbar-center" aria-label="Main">
						{NAV_ITEMS.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={`velora-navbar-link ${item.isActive(router.pathname) ? 'is-active' : ''}`}
							>
								{labelFor(item.labelKey)}
							</Link>
						))}
					</nav>

					<div className="velora-navbar-right">
						{user?._id ? (
							<>
								<button
									type="button"
									className="velora-navbar-avatar"
									onClick={(e) => setUserAnchor(e.currentTarget)}
									aria-label="Account menu"
								>
									<img
										src={
											user.memberImage
												? `${REACT_APP_API_URL}/${user.memberImage}`
												: '/img/profile/defaultUser.svg'
										}
										alt=""
									/>
								</button>
								<Menu
									anchorEl={userAnchor}
									open={Boolean(userAnchor)}
									onClose={() => setUserAnchor(null)}
									sx={{ mt: '6px' }}
								>
									<MenuItem component={Link} href="/mypage" onClick={() => setUserAnchor(null)}>
										{t('My Page')}
									</MenuItem>
									<MenuItem
										onClick={() => {
											setUserAnchor(null);
											logOut();
										}}
									>
										<Logout fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
										Logout
									</MenuItem>
								</Menu>
							</>
						) : (
							<Link href="/login" className="velora-navbar-join">
								<span className="velora-navbar-join-icon" aria-hidden>
									<AccountCircleOutlinedIcon fontSize="small" />
								</span>
								<span className="velora-navbar-join-text">
									{t('Login')} / {t('Register')}
								</span>
							</Link>
						)}

						<button
							type="button"
							className="velora-navbar-lang"
							onClick={(e) => setLangAnchor(e.currentTarget)}
							aria-label="Change language"
						>
							<img src={flagSrc} alt="" width={24} height={17} />
							<CaretDown size={14} weight="fill" aria-hidden />
						</button>

						<LangMenu anchorEl={langAnchor} open={Boolean(langAnchor)} onClose={() => setLangAnchor(null)}>
							<MenuItem onClick={() => langChoice('en')}>
								<img className="img-flag" src="/img/flag/langen.png" alt="" width={24} height={17} />
								English
							</MenuItem>
							<MenuItem onClick={() => langChoice('kr')}>
								<img className="img-flag" src="/img/flag/langkr.png" alt="" width={24} height={17} />
								Korean
							</MenuItem>
							<MenuItem onClick={() => langChoice('ru')}>
								<img className="img-flag" src="/img/flag/langru.png" alt="" width={24} height={17} />
								Russian
							</MenuItem>
						</LangMenu>
					</div>
				</div>
			</header>
		</>
	);
};

export default VeloraNavbar;
