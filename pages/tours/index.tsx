import React, { useMemo } from 'react';
import { NextPage } from 'next';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import PackageCard from '../../libs/components/packages/PackageCard';
import { CatalogGridSkeleton } from '../../libs/components/common/CatalogCardSkeleton';
import { getPackagesByType, matchesPackageSearch, sortPackages } from '../../libs/data/packages';
import { mapToursToPackages } from '../../libs/data/packageApi';
import { GET_TOURS } from '../../apollo/user/query';
import usePackageCatalog from '../../libs/hooks/usePackageCatalog';
import type { VeloraPackage } from '../../libs/types/package';
import type { TourCategory } from '../../libs/data/tours';

const TOUR_FILTER_DEFAULTS = {
	location: '',
	category: 'All',
	sort: 'recommended',
};

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ToursPage: NextPage = () => {
	const { filters, setFilter, items, allItems, isInitialLoading } = usePackageCatalog<
		VeloraPackage,
		typeof TOUR_FILTER_DEFAULTS
	>({
		query: GET_TOURS,
		selectList: (data) => data?.getTours?.list,
		mapApi: mapToursToPackages,
		fallback: () => getPackagesByType('tours'),
		filterDefaults: TOUR_FILTER_DEFAULTS,
		catalogOptions: { debounceKeys: ['location'] },
		filterItem: (tour, f) =>
			(f.category === 'All' || tour.category === f.category) && matchesPackageSearch(tour, f.location),
		sortItems: sortPackages,
	});

	const categories = useMemo(() => {
		const set = new Set<TourCategory>();
		allItems.forEach((tour) => {
			if (tour.category) set.add(tour.category as TourCategory);
		});
		return Array.from(set);
	}, [allItems]);

	const activeCategory = filters.category;

	return (
		<Stack className={'tours-page'}>
			<Stack className={'tours-toolbar container'}>
				<div className={'tours-toolbar-left'}>
					<input
						type="text"
						placeholder="Search by destination or tour"
						value={filters.location}
						onChange={(event) => setFilter('location', event.target.value)}
						className={'tours-search-input'}
					/>
				</div>

				<div className={'tours-categories'}>
					<button
						type="button"
						className={`category-pill ${activeCategory === 'All' ? 'active' : ''}`}
						onClick={() => setFilter('category', 'All')}
					>
						All
					</button>
					{categories.map((category) => (
						<button
							key={category}
							type="button"
							className={`category-pill ${activeCategory === category ? 'active' : ''}`}
							onClick={() => setFilter('category', category)}
						>
							{category}
						</button>
					))}
				</div>

				<div className={'tours-sort'}>
					<label htmlFor="tours-sort">Sort by</label>
					<select id="tours-sort" value={filters.sort} onChange={(event) => setFilter('sort', event.target.value)}>
						<option value="recommended">Recommended</option>
						<option value="priceAsc">Price · Low to High</option>
						<option value="priceDesc">Price · High to Low</option>
						<option value="rating">Top rated</option>
					</select>
				</div>
			</Stack>

			<Stack className={'tours-page-cards tour-packages-section'}>
				{isInitialLoading ? (
					<CatalogGridSkeleton count={8} />
				) : items.length === 0 ? (
					<div className={'tours-empty'}>No tours match your filters yet.</div>
				) : (
					<div className={'tour-grid'}>
						{items.map((pkg) => (
							<PackageCard key={pkg.id} pkg={pkg} />
						))}
					</div>
				)}
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(ToursPage);
