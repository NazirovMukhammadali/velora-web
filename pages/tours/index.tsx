import React, { useMemo, useState } from 'react';
import { NextPage } from 'next';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import PackageCard from '../../libs/components/packages/PackageCard';
import { getPackagesByType } from '../../libs/data/packages';
import type { TourCategory } from '../../libs/data/tours';

type SortKey = 'recommended' | 'priceAsc' | 'priceDesc' | 'rating';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const sortPackages = (list: ReturnType<typeof getPackagesByType>, sort: SortKey) => {
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

const ToursPage: NextPage = () => {
	const tours = getPackagesByType('tours');
	const categories = useMemo(() => {
		const set = new Set<TourCategory>();
		tours.forEach((t) => {
			if (t.category) set.add(t.category as TourCategory);
		});
		return Array.from(set);
	}, [tours]);

	const [activeCategory, setActiveCategory] = useState<TourCategory | 'All'>('All');
	const [sort, setSort] = useState<SortKey>('recommended');
	const [search, setSearch] = useState('');

	const filteredTours = useMemo(() => {
		const lowerSearch = search.trim().toLowerCase();
		const list = tours.filter((tour) => {
			const matchCategory = activeCategory === 'All' || tour.category === activeCategory;
			const matchSearch =
				!lowerSearch ||
				tour.title.toLowerCase().includes(lowerSearch) ||
				tour.location.toLowerCase().includes(lowerSearch);
			return matchCategory && matchSearch;
		});
		return sortPackages(list, sort);
	}, [activeCategory, sort, search, tours]);

	return (
		<Stack className={'tours-page'}>
			<Stack className={'tours-toolbar container'}>
				<div className={'tours-toolbar-left'}>
					<input
						type="text"
						placeholder="Search by destination or tour"
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						className={'tours-search-input'}
					/>
				</div>

				<div className={'tours-categories'}>
					<button
						type="button"
						className={`category-pill ${activeCategory === 'All' ? 'active' : ''}`}
						onClick={() => setActiveCategory('All')}
					>
						All
					</button>
					{categories.map((category) => (
						<button
							key={category}
							type="button"
							className={`category-pill ${activeCategory === category ? 'active' : ''}`}
							onClick={() => setActiveCategory(category)}
						>
							{category}
						</button>
					))}
				</div>

				<div className={'tours-sort'}>
					<label htmlFor="tours-sort">Sort by</label>
					<select
						id="tours-sort"
						value={sort}
						onChange={(event) => setSort(event.target.value as SortKey)}
					>
						<option value="recommended">Recommended</option>
						<option value="priceAsc">Price · Low to High</option>
						<option value="priceDesc">Price · High to Low</option>
						<option value="rating">Top rated</option>
					</select>
				</div>
			</Stack>

			<Stack className={'tours-page-cards tour-packages-section'}>
				{filteredTours.length === 0 ? (
					<div className={'tours-empty'}>No tours match your filters yet.</div>
				) : (
					<div className={'tour-grid'}>
						{filteredTours.map((pkg) => (
							<PackageCard key={pkg.id} pkg={pkg} />
						))}
					</div>
				)}
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(ToursPage);
