import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { HERO_BACKGROUNDS, HERO_SLIDE_INTERVAL_MS } from '../../data/heroBackgrounds';
import type { SearchTabKey } from '../../types/hero';
import {
	HERO_PARTY_MAX,
	HERO_PARTY_MIN,
	buildHeroSearchQuery,
	routeForSearchTab,
	validateHeroSearch,
	type HeroSearchForm,
} from '../../utils/heroSearch';

type SearchTabConfig = {
	key: SearchTabKey;
	labelKey: string;
	locationLabelKey: string;
	locationPlaceholderKey: string;
	startLabelKey: string;
	endLabelKey: string;
	passengerLabelKey: string;
	passengerPlaceholder: string;
	targetRoute: '/hotels' | '/flights' | '/rentcar';
};

const TAB_CONFIG: SearchTabConfig[] = [
	{
		key: 'hotel',
		labelKey: 'Hotel',
		locationLabelKey: 'Location',
		locationPlaceholderKey: 'City hotel placeholder',
		startLabelKey: 'Check-in',
		endLabelKey: 'Check-out',
		passengerLabelKey: 'Guests',
		passengerPlaceholder: '2',
		targetRoute: '/hotels',
	},
	{
		key: 'flights',
		labelKey: 'Flights',
		locationLabelKey: 'Location',
		locationPlaceholderKey: 'Flight destination placeholder',
		startLabelKey: 'Departure',
		endLabelKey: 'Return',
		passengerLabelKey: 'Passengers',
		passengerPlaceholder: '1',
		targetRoute: '/flights',
	},
	{
		key: 'rentcar',
		labelKey: 'Rentcar',
		locationLabelKey: 'Pick-up location',
		locationPlaceholderKey: 'City or airport',
		startLabelKey: 'Pick-up date',
		endLabelKey: 'Drop-off date',
		passengerLabelKey: 'Drivers',
		passengerPlaceholder: '1',
		targetRoute: '/rentcar',
	},
];

const EMPTY_FORM: HeroSearchForm = {
	location: '',
	from: '',
	to: '',
	startDate: '',
	endDate: '',
	party: '',
};

const HeaderFilter = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const [activeTab, setActiveTab] = useState<SearchTabKey>('hotel');
	const [slideIndex, setSlideIndex] = useState(0);
	const [reducedMotion, setReducedMotion] = useState(false);
	const [form, setForm] = useState<HeroSearchForm>(EMPTY_FORM);
	const [error, setError] = useState('');

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
		setError('');
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
		const validation = validateHeroSearch(form, activeTab);
		if (!validation.ok) {
			setError(validation.message ?? 'Please check your search details.');
			return;
		}

		setError('');
		const route = routeForSearchTab(activeTab);
		const query = buildHeroSearchQuery(form, route, validation.party ?? '');

		await router.push({
			pathname: route,
			query,
		});
	};

	const handleField = (name: keyof HeroSearchForm, value: string) => {
		setForm((prev) => ({ ...prev, [name]: value }));
		if (error) setError('');
	};

	const isFlights = activeTab === 'flights';

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
								{t(tab.labelKey)}
							</button>
						))}
					</div>

					<form className="velora-hero-search-form" onSubmit={onSubmit} noValidate>
						{isFlights ? (
							<>
								<div className="field-group location">
									<label htmlFor="hero-from">{t('From')}</label>
									<input
										id="hero-from"
										type="text"
										value={form.from}
										placeholder={t('City or airport')}
										onChange={(event) => handleField('from', event.target.value)}
										autoComplete="off"
									/>
								</div>
								<div className="field-group location">
									<label htmlFor="hero-to">{t('To')}</label>
									<input
										id="hero-to"
										type="text"
										value={form.to}
										placeholder={t('City or airport')}
										onChange={(event) => handleField('to', event.target.value)}
										autoComplete="off"
									/>
								</div>
							</>
						) : (
							<div className="field-group location">
								<label htmlFor="hero-location">{t(activeConfig.locationLabelKey)}</label>
								<input
									id="hero-location"
									type="text"
									value={form.location}
									placeholder={t(activeConfig.locationPlaceholderKey)}
									onChange={(event) => handleField('location', event.target.value)}
									autoComplete="off"
								/>
							</div>
						)}

						<div className="field-group date">
							<label htmlFor="hero-start-date">{t(activeConfig.startLabelKey)}</label>
							<input
								id="hero-start-date"
								type="date"
								value={form.startDate}
								onChange={(event) => handleField('startDate', event.target.value)}
							/>
						</div>

						<div className="field-group date">
							<label htmlFor="hero-end-date">{t(activeConfig.endLabelKey)}</label>
							<input
								id="hero-end-date"
								type="date"
								value={form.endDate}
								min={form.startDate || undefined}
								onChange={(event) => handleField('endDate', event.target.value)}
							/>
						</div>

						<div className="field-group party">
							<label htmlFor="hero-party">{t(activeConfig.passengerLabelKey)}</label>
							<input
								id="hero-party"
								type="number"
								inputMode="numeric"
								min={HERO_PARTY_MIN}
								max={HERO_PARTY_MAX}
								value={form.party}
								placeholder={activeConfig.passengerPlaceholder}
								onChange={(event) => handleField('party', event.target.value)}
							/>
						</div>

						<button className="velora-hero-search-submit" type="submit">
							{t('Search')}
						</button>
					</form>

					{error ? (
						<p className="velora-hero-search-error" role="alert">
							{error}
						</p>
					) : null}
				</div>
			</div>
		</section>
	);
};

export default HeaderFilter;
