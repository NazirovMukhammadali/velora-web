import React from 'react';
import { NextPage } from 'next';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import PackageCard from '../../libs/components/packages/PackageCard';
import { CatalogGridSkeleton } from '../../libs/components/common/CatalogCardSkeleton';
import { getPackagesByType, matchesPackageSearch, sortPackages } from '../../libs/data/packages';
import { mapRentcarsToPackages } from '../../libs/data/packageApi';
import { GET_RENTCARS } from '../../apollo/user/query';
import usePackageCatalog from '../../libs/hooks/usePackageCatalog';
import type { VeloraPackage } from '../../libs/types/package';

type PriceKey = 'any' | 'under75' | '75to150' | 'over150';
type CategoryKey = 'all' | 'compact' | 'suv' | 'sedan' | 'luxury' | 'electric';

const RENTCAR_FILTER_DEFAULTS = {
	location: '',
	price: 'any',
	category: 'all',
	sort: 'recommended',
};

const PRICE_RANGES: { key: PriceKey; label: string }[] = [
	{ key: 'any', label: 'Any price' },
	{ key: 'under75', label: 'Under $75' },
	{ key: '75to150', label: '$75 – $150' },
	{ key: 'over150', label: '$150+' },
];

const CATEGORIES: { key: CategoryKey; label: string }[] = [
	{ key: 'all', label: 'All types' },
	{ key: 'compact', label: 'Compact' },
	{ key: 'suv', label: 'SUV' },
	{ key: 'sedan', label: 'Sedan' },
	{ key: 'luxury', label: 'Luxury' },
	{ key: 'electric', label: 'Electric' },
];

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const inPriceRange = (price: number, range: string): boolean => {
	switch (range) {
		case 'under75':
			return price < 75;
		case '75to150':
			return price >= 75 && price <= 150;
		case 'over150':
			return price > 150;
		default:
			return true;
	}
};

const matchesCategory = (car: VeloraPackage, category: string): boolean => {
	if (category === 'all') return true;
	const haystack = `${car.title} ${car.subtitle} ${car.category ?? ''}`.toLowerCase();
	switch (category) {
		case 'compact':
			return haystack.includes('compact') || haystack.includes('hatchback');
		case 'suv':
			return haystack.includes('suv') || haystack.includes('4x4') || haystack.includes('off-road');
		case 'sedan':
			return haystack.includes('sedan') || haystack.includes('coupe');
		case 'luxury':
			return (
				haystack.includes('luxury') ||
				haystack.includes('porsche') ||
				haystack.includes('range rover') ||
				haystack.includes('mercedes')
			);
		case 'electric':
			return haystack.includes('electric') || haystack.includes('tesla');
		default:
			return true;
	}
};

const RentcarPage: NextPage = () => {
	const { filters, setFilter, items, total, isInitialLoading } = usePackageCatalog<
		VeloraPackage,
		typeof RENTCAR_FILTER_DEFAULTS
	>({
		query: GET_RENTCARS,
		selectList: (data) => data?.getRentcars?.list,
		mapApi: mapRentcarsToPackages,
		fallback: () => getPackagesByType('cars'),
		filterDefaults: RENTCAR_FILTER_DEFAULTS,
		catalogOptions: { debounceKeys: ['location'] },
		filterItem: (car, f) =>
			matchesPackageSearch(car, f.location) && inPriceRange(car.priceAmount, f.price) && matchesCategory(car, f.category),
		sortItems: sortPackages,
	});

	return (
		<Stack className={'tours-page rentcar-page'}>
			<Stack className={'container'}>
				<div className={'catalog-intro'}>
					<span className={'catalog-eyebrow'}>Rentals</span>
					<h1 className={'catalog-title'}>Drive the trip of your dreams</h1>
					<p className={'catalog-sub'}>
						Compact city cars, family SUVs, and premium rides — compare daily rates with clear inclusions and open any
						card for full specs and booking.
					</p>
				</div>
			</Stack>

			<Stack className={'tours-toolbar container'}>
				<div className={'tours-toolbar-left'}>
					<input
						type="text"
						placeholder="Search by city or car model"
						value={filters.location}
						onChange={(event) => setFilter('location', event.target.value)}
						className={'tours-search-input'}
					/>
				</div>

				<div className={'tours-categories'}>
					{CATEGORIES.map((item) => (
						<button
							key={item.key}
							type="button"
							className={`category-pill ${filters.category === item.key ? 'active' : ''}`}
							onClick={() => setFilter('category', item.key)}
						>
							{item.label}
						</button>
					))}
				</div>

				<div className={'tours-categories rentcar-price-pills'}>
					{PRICE_RANGES.map((range) => (
						<button
							key={range.key}
							type="button"
							className={`category-pill ${filters.price === range.key ? 'active' : ''}`}
							onClick={() => setFilter('price', range.key)}
						>
							{range.label}
						</button>
					))}
				</div>

				<div className={'tours-sort'}>
					<label htmlFor="rentcar-sort">Sort by</label>
					<select id="rentcar-sort" value={filters.sort} onChange={(event) => setFilter('sort', event.target.value)}>
						<option value="recommended">Recommended</option>
						<option value="priceAsc">Price · Low to High</option>
						<option value="priceDesc">Price · High to Low</option>
						<option value="rating">Top rated</option>
					</select>
				</div>
			</Stack>

			<Stack className={'container'}>
				<p className={'catalog-count'}>
					{total} {total === 1 ? 'car' : 'cars'} available
				</p>
			</Stack>

			<Stack className={'tours-page-cards tour-packages-section'}>
				{isInitialLoading ? (
					<CatalogGridSkeleton count={8} />
				) : items.length === 0 ? (
					<div className={'tours-empty'}>No cars match your filters yet.</div>
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

export default withLayoutBasic(RentcarPage);
