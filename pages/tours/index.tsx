import React, { useMemo, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { TOURS, TOUR_CATEGORIES, Tour, TourCategory } from '../../libs/data/tours';

type SortKey = 'recommended' | 'priceAsc' | 'priceDesc' | 'rating';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const formatPrice = (value: number) => `$${value.toLocaleString('en-US')}`;

const sortTours = (tours: Tour[], sort: SortKey): Tour[] => {
	const cloned = [...tours];
	switch (sort) {
		case 'priceAsc':
			return cloned.sort((a, b) => a.pricePerPerson - b.pricePerPerson);
		case 'priceDesc':
			return cloned.sort((a, b) => b.pricePerPerson - a.pricePerPerson);
		case 'rating':
			return cloned.sort((a, b) => b.rating - a.rating);
		default:
			return cloned;
	}
};

const ToursPage: NextPage = () => {
	const [activeCategory, setActiveCategory] = useState<TourCategory | 'All'>('All');
	const [sort, setSort] = useState<SortKey>('recommended');
	const [search, setSearch] = useState('');

	const filteredTours = useMemo(() => {
		const lowerSearch = search.trim().toLowerCase();
		const list = TOURS.filter((tour) => {
			const matchCategory = activeCategory === 'All' || tour.category === activeCategory;
			const matchSearch =
				!lowerSearch ||
				tour.title.toLowerCase().includes(lowerSearch) ||
				tour.location.toLowerCase().includes(lowerSearch) ||
				tour.country.toLowerCase().includes(lowerSearch);
			return matchCategory && matchSearch;
		});
		return sortTours(list, sort);
	}, [activeCategory, sort, search]);

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
					{TOUR_CATEGORIES.map((category) => (
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

			<Stack className={'tours-grid container'}>
				{filteredTours.length === 0 ? (
					<div className={'tours-empty'}>No tours match your filters yet.</div>
				) : (
					filteredTours.map((tour) => (
						<Link
							key={tour.id}
							href={{ pathname: '/tours/detail', query: { id: tour.id } }}
							className={'tour-grid-card'}
						>
							<div className={'tour-grid-image'}>
								<img src={tour.image} alt={tour.title} />
								{tour.badge && <span className={'tour-grid-badge'}>{tour.badge}</span>}
							</div>
							<div className={'tour-grid-info'}>
								<span className={'tour-grid-category'}>{tour.category}</span>
								<h3>{tour.title}</h3>
								<p>
									{tour.location}, {tour.country} · {tour.durationDays} days
								</p>
								<div className={'tour-grid-bottom'}>
									<strong>
										{formatPrice(tour.pricePerPerson)} <span>/ person</span>
									</strong>
									<em>★ {tour.rating.toFixed(1)} ({tour.reviews})</em>
								</div>
							</div>
						</Link>
					))
				)}
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(ToursPage);
