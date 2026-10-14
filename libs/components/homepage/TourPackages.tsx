import React, { useMemo, useState } from 'react';
import { useQuery, type DocumentNode } from '@apollo/client';
import type { PackageType, VeloraPackage } from '../../types/package';
import { getPackagesByType, PACKAGE_TABS } from '../../data/packages';
import { mapHotelsToPackages, mapRentcarsToPackages, mapToursToPackages } from '../../data/packageApi';
import { GET_HOTELS, GET_RENTCARS, GET_TOURS } from '../../../apollo/user/query';
import PackageCard from '../packages/PackageCard';

const HOME_LIMIT = 8;

const TAB_SOURCES: Record<PackageType, { query: DocumentNode; toPackages: (data: any) => VeloraPackage[] }> = {
	tours: { query: GET_TOURS, toPackages: (data) => mapToursToPackages(data?.getTours?.list) },
	hotels: { query: GET_HOTELS, toPackages: (data) => mapHotelsToPackages(data?.getHotels?.list) },
	cars: { query: GET_RENTCARS, toPackages: (data) => mapRentcarsToPackages(data?.getRentcars?.list) },
};

const TourPackages = () => {
	const [activeTab, setActiveTab] = useState<PackageType>('tours');

	const activeMeta = useMemo(() => PACKAGE_TABS.find((tab) => tab.key === activeTab) ?? PACKAGE_TABS[0], [activeTab]);

	const source = TAB_SOURCES[activeTab];
	const { data } = useQuery(source.query, {
		fetchPolicy: 'cache-and-network',
		errorPolicy: 'all',
		variables: { input: { page: 1, limit: HOME_LIMIT, sort: 'createdAt', direction: 'DESC', search: {} } },
	});

	// API-first, same as the catalog pages; the curated static set covers an empty/offline backend.
	const items = useMemo(() => {
		const apiItems = source.toPackages(data);
		return (apiItems.length > 0 ? apiItems : getPackagesByType(activeTab)).slice(0, HOME_LIMIT);
	}, [data, source, activeTab]);

	return (
		<section className={'tour-packages-section'}>
			<div className={'tour-section-head'}>
				<span>{activeMeta.eyebrow}</span>
				<h2>{activeMeta.headline}</h2>
				<div className={'tour-tabs'}>
					{PACKAGE_TABS.map((tab) => (
						<button
							key={tab.key}
							type={'button'}
							className={tab.key === activeTab ? 'active' : ''}
							onClick={() => setActiveTab(tab.key)}
						>
							{tab.label}
						</button>
					))}
				</div>
			</div>

			<div className={'tour-grid'}>
				{items.map((pkg) => (
					<PackageCard key={`${pkg.type}-${pkg.id}`} pkg={pkg} />
				))}
			</div>
		</section>
	);
};

export default TourPackages;
