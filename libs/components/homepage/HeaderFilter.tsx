import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { HERO_BACKGROUNDS, HERO_SLIDE_INTERVAL_MS } from '../../data/heroBackgrounds';
import type { SearchTabKey } from '../../types/hero';

type SearchTabConfig = {
	key: SearchTabKey;
	label: string;
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
		key: 'hotel',
		label: 'Hotel',
		locationLabel: 'Location',
		locationPlaceholder: 'City, region, or hotel name',
		startLabel: 'Check-in',
		endLabel: 'Check-out',
		passengerLabel: 'Guests',
		passengerPlaceholder: '2 Guests',
		targetRoute: '/hotels',
	},
	{
		key: 'flights',
		label: 'Flights',
		locationLabel: 'Destination',
		locationPlaceholder: 'Where do you want to fly?',
		startLabel: 'Departure',
		endLabel: 'Return',
		passengerLabel: 'Passengers',
		passengerPlaceholder: '1 Passenger',
		targetRoute: '/flights',
	},
	{
		key: 'rentcar',
		label: 'RentCar',
		locationLabel: 'Pick-up location',
		locationPlaceholder: 'City or airport',
		startLabel: 'Pick-up date',
		endLabel: 'Drop-off date',
		passengerLabel: 'Drivers',
		passengerPlaceholder: '1 Driver',
		targetRoute: '/rentcar',
	},
];

const HeaderFilter = () => {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<SearchTabKey>('hotel');
	const [slideIndex, setSlideIndex] = useState(0);
	const [reducedMotion, setReducedMotion] = useState(false);
	const [form, setForm] = useState({
		location: '',
		startDate: '',
		endDate: '',
		travelers: '',
	});

	const slides = HERO_BACKGROUNDS[activeTab];

	const activeConfig = useMemo(
		() => TAB_CONFIG.find((item) => item.key === activeTab) ?? TAB_CONFIG[0],
		[activeTab],
	);

	useEffect(() => {
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		const update = () => setReducedMotion(mq.matches);
		update();
		mq.addEventListener('change', update);
		return () => mq.removeEventListener('change', update);
	}, []);

	useEffect(() => {
		setSlideIndex(0);
	}, [activeTab]);

	useEffect(() => {
		if (reducedMotion || slides.length <= 1) return;
		const timer = window.setInterval(() => {
			setSlideIndex((prev) => (prev + 1) % slides.length);
		}, HERO_SLIDE_INTERVAL_MS);
		return () => window.clearInterval(timer);
	}, [activeTab, slides.length, reducedMotion]);

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

	return (
		<section className="velora-hero" aria-label="Travel search">
			<div className="velora-hero-backdrops" aria-hidden="true">
				{slides.map((url, index) => (
					<div
						key={`${activeTab}-${url}`}
						className={`velora-hero-backdrop ${index === slideIndex ? 'is-active' : ''}`}
						style={{ backgroundImage: `url(${url})` }}
					/>
				))}
			</div>
			<div className="velora-hero-scrim" aria-hidden="true" />

			<div className="velora-hero-bottom">
				<div className="velora-hero-search-card">
					<div className="velora-hero-search-tabs" role="tablist" aria-label="Search category">
						{TAB_CONFIG.map((tab) => (
							<button
								type="button"
								key={tab.key}
								role="tab"
								aria-selected={activeTab === tab.key}
								className={`velora-hero-search-tab ${activeTab === tab.key ? 'is-active' : ''}`}
								onClick={() => setActiveTab(tab.key)}
							>
								{tab.label}
							</button>
						))}
					</div>

					<form className="velora-hero-search-form" onSubmit={onSubmit}>
						<div className="field-group location">
							<label htmlFor="hero-location">{activeConfig.locationLabel}</label>
							<input
								id="hero-location"
								type="text"
								value={form.location}
								placeholder={activeConfig.locationPlaceholder}
								onChange={(event) => handleField('location', event.target.value)}
							/>
						</div>

						<div className="field-group date">
							<label htmlFor="hero-start-date">{activeConfig.startLabel}</label>
							<input
								id="hero-start-date"
								type="date"
								value={form.startDate}
								onChange={(event) => handleField('startDate', event.target.value)}
							/>
						</div>

						<div className="field-group date">
							<label htmlFor="hero-end-date">{activeConfig.endLabel}</label>
							<input
								id="hero-end-date"
								type="date"
								value={form.endDate}
								onChange={(event) => handleField('endDate', event.target.value)}
							/>
						</div>

						<div className="field-group party">
							<label htmlFor="hero-party">{activeConfig.passengerLabel}</label>
							<input
								id="hero-party"
								type="text"
								value={form.travelers}
								placeholder={activeConfig.passengerPlaceholder}
								onChange={(event) => handleField('travelers', event.target.value)}
							/>
						</div>

						<button className="velora-hero-search-submit" type="submit">
							Search
						</button>
					</form>
				</div>
			</div>
		</section>
	);
};

export default HeaderFilter;
