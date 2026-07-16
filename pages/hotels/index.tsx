import React from 'react';
import { NextPage } from 'next';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import PackageCard from '../../libs/components/packages/PackageCard';
import { CatalogGridSkeleton } from '../../libs/components/common/CatalogCardSkeleton';
import { getPackagesByType, matchesPackageSearch, sortPackages } from '../../libs/data/packages';
import { mapHotelsToPackages } from '../../libs/data/packageApi';
import { GET_HOTELS } from '../../apollo/user/query';
import usePackageCatalog from '../../libs/hooks/usePackageCatalog';
import type { VeloraPackage } from '../../libs/types/package';

type PriceKey = 'any' | 'under100' | '100to200' | 'over200';

const HOTEL_FILTER_DEFAULTS = {
	location: '',
	price: 'any',
	sort: 'recommended',
};

const PRICE_RANGES: { key: PriceKey; label: string }[] = [
	{ key: 'any', label: 'Any price' },
	{ key: 'under100', label: 'Under $100' },
	{ key: '100to200', label: '$100 – $200' },
	{ key: 'over200', label: '$200+' },
];

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const inPriceRange = (price: number, range: string): boolean => {
	switch (range) {
		case 'under100':
			return price < 100;
		case '100to200':
			return price >= 100 && price <= 200;
		case 'over200':
			return price > 200;
		default:
			return true;
	}
};

const HotelsPage: NextPage = () => {
	const { filters, setFilter, items, total, isInitialLoading } = usePackageCatalog<
		VeloraPackage,
		typeof HOTEL_FILTER_DEFAULTS
	>({
		query: GET_HOTELS,
		selectList: (data) => data?.getHotels?.list,
		mapApi: mapHotelsToPackages,
		fallback: () => getPackagesByType('hotels'),
		filterDefaults: HOTEL_FILTER_DEFAULTS,
		catalogOptions: { debounceKeys: ['location'] },
		filterItem: (hotel, f) => matchesPackageSearch(hotel, f.location) && inPriceRange(hotel.priceAmount, f.price),
		sortItems: sortPackages,
	});

	return (
		<Stack className={'tours-page'}>
			<Stack className={'container'}>
				<div className={'catalog-intro'}>
					<span className={'catalog-eyebrow'}>Stays</span>
					<h1 className={'catalog-title'}>Find your perfect hotel</h1>
					<p className={'catalog-sub'}>
						Boutique riads, glass igloos, and city classics — compare verified stays with clear pricing and open any
						card for full details and booking.
					</p>
				</div>
			</Stack>

			<Stack className={'tours-toolbar container'}>
				<div className={'tours-toolbar-left'}>
					<input
						type="text"
						placeholder="Search by city or hotel name"
						value={filters.location}
						onChange={(event) => setFilter('location', event.target.value)}
						className={'tours-search-input'}
					/>
				</div>

				<div className={'tours-categories'}>
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
					<label htmlFor="hotels-sort">Sort by</label>
					<select id="hotels-sort" value={filters.sort} onChange={(event) => setFilter('sort', event.target.value)}>
						<option value="recommended">Recommended</option>
						<option value="priceAsc">Price · Low to High</option>
						<option value="priceDesc">Price · High to Low</option>
						<option value="rating">Top rated</option>
					</select>
				</div>
			</Stack>

			<Stack className={'container'}>
				<p className={'catalog-count'}>
					{total} {total === 1 ? 'hotel' : 'hotels'} available
				</p>
			</Stack>

			<Stack className={'tours-page-cards tour-packages-section'}>
				{isInitialLoading ? (
					<CatalogGridSkeleton count={8} />
				) : items.length === 0 ? (
					<div className={'tours-empty'}>No hotels match your filters yet.</div>
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

export default withLayoutBasic(HotelsPage);
