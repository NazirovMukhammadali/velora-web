import React, { FormEvent, useMemo, useState } from 'react';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
type SearchTabKey = 'flights' | 'hotel' | 'rentcar';

type SearchTabConfig = {
	key: SearchTabKey;
	label: string;
	description: string;
	locationLabel: string;
	locationPlaceholder: string;
	startLabel: string;
	endLabel: string;
	passengerLabel: string;
	passengerPlaceholder: string;
	targetRoute: string;
};

const TAB_CONFIG: SearchTabConfig[] = [
	{
		key: 'flights',
		label: 'Flights',
		description: 'Compare flight deals from trusted travel platforms.',
		locationLabel: 'Destination',
		locationPlaceholder: 'Where do you want to fly?',
		startLabel: 'Departure',
		endLabel: 'Return',
		passengerLabel: 'Passengers',
		passengerPlaceholder: '1 Passenger',
		targetRoute: '/flights',
	},
	{
		key: 'hotel',
		label: 'Hotel',
		description: 'Compare hotel offers from hundreds of travel sites.',
		locationLabel: 'Location',
		locationPlaceholder: 'City, region, or hotel name',
		startLabel: 'Check-in',
		endLabel: 'Check-out',
		passengerLabel: 'Guests',
		passengerPlaceholder: '2 Guests',
		targetRoute: '/hotels',
	},
	{
		key: 'rentcar',
		label: 'RentCar',
		description: 'Find and compare car rental options for your trip.',
		locationLabel: 'Pick-up location',
		locationPlaceholder: 'City or airport',
		startLabel: 'Pick-up date',
		endLabel: 'Drop-off date',
		passengerLabel: 'Drivers',
		passengerPlaceholder: '1 Driver',
		targetRoute: '/rentcar',
	},
];

type ThemeMode = 'light' | 'dark';
type LanguageCode = 'EN' | 'UZ' | 'KO';

const LANGUAGE_CYCLE: LanguageCode[] = ['EN', 'UZ', 'KO'];

const SunIcon = () => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
	>
		<circle cx="12" cy="12" r="4" />
		<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
	</svg>
);

const MoonIcon = () => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
	>
		<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
	</svg>
);

const GlobeIcon = () => (
	<svg
		width="14"
		height="14"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
	>
		<circle cx="12" cy="12" r="10" />
		<path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
	</svg>
);

const HeaderFilter = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<SearchTabKey>('flights');
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [theme, setTheme] = useState<ThemeMode>('light');
	const [language, setLanguage] = useState<LanguageCode>('EN');
	const [form, setForm] = useState({
		location: '',
		startDate: '',
		endDate: '',
		travelers: '',
	});

	const activeConfig = useMemo(
		() => TAB_CONFIG.find((item) => item.key === activeTab) ?? TAB_CONFIG[0],
		[activeTab],
	);

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		await router.push({
			pathname: activeConfig.targetRoute,
			query: {
				location: form.location,
				startDate: form.startDate,
				endDate: form.endDate,
				party: form.travelers,
			},
		});
	};

	const handleField = (name: 'location' | 'startDate' | 'endDate' | 'travelers', value: string) => {
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectTab = (tabKey: SearchTabKey) => {
		setActiveTab(tabKey);
		setDrawerOpen(false);
	};

	const handleToggleTheme = () => {
		setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
	};

	const handleCycleLanguage = () => {
		setLanguage((prev) => {
			const idx = LANGUAGE_CYCLE.indexOf(prev);
			return LANGUAGE_CYCLE[(idx + 1) % LANGUAGE_CYCLE.length];
		});
	};

	const handleLogin = () => {
		router.push('/login');
	};

	return (
		<>
			<div
				className={`hero-drawer-overlay ${drawerOpen ? 'open' : ''}`}
				onClick={() => setDrawerOpen(false)}
				aria-hidden="true"
			/>
			<aside className={`hero-drawer ${drawerOpen ? 'open' : ''}`}>
				<div className="hero-drawer-head">
					<span>VELORA</span>
				</div>
				<div className="hero-drawer-items">
					{TAB_CONFIG.map((tab) => (
						<button
							type="button"
							key={`drawer-${tab.key}`}
							className={`hero-drawer-item ${activeTab === tab.key ? 'active' : ''}`}
							onClick={() => handleSelectTab(tab.key)}
						>
							{tab.label}
						</button>
					))}
				</div>
			</aside>

			<header className={'velora-shell-topbar'}>
				<button
					type="button"
					className={'menu-button'}
					onClick={() => setDrawerOpen((prev) => !prev)}
					aria-label="Toggle travel menu"
				>
					<span />
					<span />
					<span />
				</button>
				<span className={'brand'}>VELORA</span>
				<div className={'hero-actions'}>
					<button type="button" className={'hero-action-login'} onClick={handleLogin}>
						Log in
					</button>
					<button
						type="button"
						className={'hero-action-icon'}
						onClick={handleToggleTheme}
						aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
					>
						{theme === 'light' ? <MoonIcon /> : <SunIcon />}
					</button>
					<button
						type="button"
						className={'hero-action-icon lang'}
						onClick={handleCycleLanguage}
						aria-label={`Change language. Current: ${language}`}
					>
						<GlobeIcon />
						<span>{language}</span>
					</button>
				</div>
			</header>

			<Stack className={`compact-hero ${device === 'mobile' ? 'mobile' : 'desktop'}`}>
			<div className={'hero-layout'}>
				<Stack className={'hero-content'}>
					<h1 className={'hero-title'}>{activeConfig.description}</h1>

					<Stack className={'hero-tabs'}>
						{TAB_CONFIG.map((tab) => (
							<button
								type="button"
								key={tab.key}
								className={`hero-tab ${activeTab === tab.key ? 'active' : ''}`}
								onClick={() => handleSelectTab(tab.key)}
							>
								{tab.label}
							</button>
						))}
					</Stack>

					<form className={'hero-search-form'} onSubmit={onSubmit}>
						<div className={'field-group location'}>
							<label htmlFor="hero-location">{activeConfig.locationLabel}</label>
							<input
								id="hero-location"
								type="text"
								value={form.location}
								placeholder={activeConfig.locationPlaceholder}
								onChange={(event) => handleField('location', event.target.value)}
							/>
						</div>

						<div className={'field-group date'}>
							<label htmlFor="hero-start-date">{activeConfig.startLabel}</label>
							<input
								id="hero-start-date"
								type="date"
								value={form.startDate}
								onChange={(event) => handleField('startDate', event.target.value)}
							/>
						</div>

						<div className={'field-group date'}>
							<label htmlFor="hero-end-date">{activeConfig.endLabel}</label>
							<input
								id="hero-end-date"
								type="date"
								value={form.endDate}
								onChange={(event) => handleField('endDate', event.target.value)}
							/>
						</div>

						<div className={'field-group party'}>
							<label htmlFor="hero-party">{activeConfig.passengerLabel}</label>
							<input
								id="hero-party"
								type="text"
								value={form.travelers}
								placeholder={activeConfig.passengerPlaceholder}
								onChange={(event) => handleField('travelers', event.target.value)}
							/>
						</div>

						<button className={'search-submit'} type="submit">
							Search
						</button>
					</form>
				</Stack>

				<div className={'hero-gallery'} aria-hidden="true">
					<img src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=600&q=80" alt="" />
					<img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80" alt="" />
					<img src="https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80" alt="" />
					<img src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80" alt="" />
					<img src="https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=600&q=80" alt="" />
					<img src="https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=600&q=80" alt="" />
				</div>
			</div>
			</Stack>
		</>
	);
};

export default HeaderFilter;
