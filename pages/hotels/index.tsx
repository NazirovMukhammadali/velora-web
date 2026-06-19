import React, { useEffect, useMemo, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import PackageCard from '../../libs/components/packages/PackageCard';
import { getPackagesByType } from '../../libs/data/packages';
import { mapHotelsToPackages } from '../../libs/data/packageApi';
import { GET_HOTELS } from '../../apollo/user/query';

type SortKey = 'recommended' | 'priceAsc' | 'priceDesc' | 'rating';
type PriceKey = 'any' | 'under100' | '100to200' | 'over200';

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

const inPriceRange = (price: number, range: PriceKey): boolean => {
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

const sortHotels = (list: ReturnType<typeof getPackagesByType>, sort: SortKey) => {
	const cloned = [...list];
	switch (sort) {
		case 'priceAsc':
			return cloned.sort((a, b) => a.priceAmount - b.priceAmount);
		case 'priceDesc':
			return cloned.sort((a, b) => b.priceAmount - a.priceAmount);
		case 'rating':
			return cloned.sort((a, b) => b.rating - a.rating);
		default:
			return cloned;
	}
};

const HotelsPage: NextPage = () => {
	const router = useRouter();
	const { data } = useQuery(GET_HOTELS, {
		fetchPolicy: 'cache-and-network',
		errorPolicy: 'all',
		variables: { input: { page: 1, limit: 24, sort: 'createdAt', direction: 'DESC' } },
	});

	// API-first: show backend hotels when available, otherwise fall back to the static catalog.
	const hotels = useMemo(() => {
		const apiHotels = mapHotelsToPackages(data?.getHotels?.list);
		return apiHotels.length > 0 ? apiHotels : getPackagesByType('hotels');
	}, [data]);

	const [search, setSearch] = useState('');
	const [price, setPrice] = useState<PriceKey>('any');
	const [sort, setSort] = useState<SortKey>('recommended');

	// Prefill search from the home-page hero ("Hotel" tab pushes ?location=...).
	useEffect(() => {
		if (!router.isReady) return;
		const loc = typeof router.query.location === 'string' ? router.query.location : '';
		if (loc) setSearch(loc);
	}, [router.isReady, router.query.location]);

	const filteredHotels = useMemo(() => {
		const lowerSearch = search.trim().toLowerCase();
		const list = hotels.filter((hotel) => {
			const matchSearch =
				!lowerSearch ||
				hotel.title.toLowerCase().includes(lowerSearch) ||
				hotel.location.toLowerCase().includes(lowerSearch);
			return matchSearch && inPriceRange(hotel.priceAmount, price);
		});
		return sortHotels(list, sort);
	}, [hotels, search, price, sort]);

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
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						className={'tours-search-input'}
					/>
				</div>

				<div className={'tours-categories'}>
					{PRICE_RANGES.map((range) => (
						<button
							key={range.key}
							type="button"
							className={`category-pill ${price === range.key ? 'active' : ''}`}
							onClick={() => setPrice(range.key)}
						>
							{range.label}
						</button>
					))}
				</div>

				<div className={'tours-sort'}>
					<label htmlFor="hotels-sort">Sort by</label>
					<select id="hotels-sort" value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
						<option value="recommended">Recommended</option>
						<option value="priceAsc">Price · Low to High</option>
						<option value="priceDesc">Price · High to Low</option>
						<option value="rating">Top rated</option>
					</select>
				</div>
			</Stack>

			<Stack className={'container'}>
				<p className={'catalog-count'}>
					{filteredHotels.length} {filteredHotels.length === 1 ? 'hotel' : 'hotels'} available
				</p>
			</Stack>

			<Stack className={'tours-page-cards tour-packages-section'}>
				{filteredHotels.length === 0 ? (
					<div className={'tours-empty'}>No hotels match your filters yet.</div>
				) : (
					<div className={'tour-grid'}>
						{filteredHotels.map((pkg) => (
							<PackageCard key={pkg.id} pkg={pkg} />
						))}
					</div>
				)}
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(HotelsPage);
