import React, { useMemo, useState } from 'react';
import type { PackageType } from '../../types/package';
import { getPackagesByType, PACKAGE_TABS } from '../../data/packages';
import PackageCard from '../packages/PackageCard';

const TourPackages = () => {
	const [activeTab, setActiveTab] = useState<PackageType>('tours');

	const activeMeta = useMemo(
		() => PACKAGE_TABS.find((tab) => tab.key === activeTab) ?? PACKAGE_TABS[0],
		[activeTab],
	);

	const items = useMemo(() => getPackagesByType(activeTab), [activeTab]);

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
