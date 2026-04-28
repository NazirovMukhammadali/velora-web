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

const HeaderFilter = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<SearchTabKey>('flights');
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

	return (
		<Stack className={`compact-hero ${device === 'mobile' ? 'mobile' : 'desktop'}`}>
			<Stack className={'hero-header'}>
				<span className={'brand'}>VELORA</span>
			</Stack>

			<Stack className={'hero-content'}>
				<h1 className={'hero-title'}>{activeConfig.description}</h1>

				<Stack className={'hero-tabs'}>
					{TAB_CONFIG.map((tab) => (
						<button
							type="button"
							key={tab.key}
							className={`hero-tab ${activeTab === tab.key ? 'active' : ''}`}
							onClick={() => setActiveTab(tab.key)}
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
		</Stack>
	);
};

export default HeaderFilter;
