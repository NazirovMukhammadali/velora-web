import React, { useMemo, useState } from 'react';

type ShowcaseTabKey = 'tours' | 'hotels' | 'cars';

type ShowcaseItem = {
	title: string;
	location: string;
	subtitle: string;
	price: string;
	reviews: string;
	image: string;
	badge?: string;
};

type ShowcaseTab = {
	key: ShowcaseTabKey;
	label: string;
	eyebrow: string;
	headline: string;
	priceUnit: string;
	items: ShowcaseItem[];
};

const SHOWCASE_TABS: ShowcaseTab[] = [
	{
		key: 'tours',
		label: 'Popular Tours',
		eyebrow: 'Most Popular Tour Packages',
		headline: 'Something Amazing Waiting For You',
		priceUnit: '/ Person',
		items: [
			{
				title: 'Two Hour Walking Tour Of Manhattan',
				location: 'Venice City, Italy',
				subtitle: '7 Days',
				price: '$320',
				reviews: '5 Reviews',
				image: '/img/banner/header1.svg',
				badge: 'New',
			},
			{
				title: 'When You Visit The Eternal Dubai City',
				location: 'Dubai, Emirates',
				subtitle: '2 Days',
				price: '$149',
				reviews: '6 Reviews',
				image: '/img/banner/header2.svg',
				badge: 'Offer',
			},
			{
				title: 'The Pulau Seribu, Jakarta Indonesia',
				location: 'Dekor Land, Thailand',
				subtitle: '5 Days',
				price: '$349',
				reviews: '6 Reviews',
				image: '/img/banner/header3.svg',
				badge: 'New',
			},
			{
				title: 'American Parks Trail End Rapid City Express',
				location: 'New York, USA',
				subtitle: '3 Days',
				price: '$255',
				reviews: '4 Reviews',
				image: '/img/banner/header2.svg',
				badge: 'Featured',
			},
			{
				title: 'Southwestern Switzerland Akan City',
				location: 'Switzerland City',
				subtitle: '6 Days',
				price: '$289',
				reviews: '7 Reviews',
				image: '/img/banner/header3.svg',
			},
			{
				title: 'Modern Stefano La Piazze Wergeland',
				location: 'East Norway',
				subtitle: '4 Days',
				price: '$199',
				reviews: '8 Reviews',
				image: '/img/banner/header1.svg',
				badge: 'Featured',
			},
			{
				title: 'Vatican Museums, Sistine Chapel Skip The Line',
				location: 'Rome City',
				subtitle: '1 Day',
				price: '$119',
				reviews: '9 Reviews',
				image: '/img/banner/header2.svg',
			},
			{
				title: 'Twin Cities On Opposite Sides Of The Harbor',
				location: 'Sydney, Australia',
				subtitle: '3 Days',
				price: '$255',
				reviews: '4 Reviews',
				image: '/img/banner/header3.svg',
			},
		],
	},
	{
		key: 'hotels',
		label: 'Popular Hotels',
		eyebrow: 'Most Booked Stays',
		headline: 'Stay In Comfort, Wake Up Inspired',
		priceUnit: '/ Night',
		items: [
			{
				title: 'The Grand Marina Bay Suites',
				location: 'Singapore, Singapore',
				subtitle: '5★ Hotel',
				price: '$210',
				reviews: '12 Reviews',
				image: '/img/banner/header2.svg',
				badge: 'Featured',
			},
			{
				title: 'Riviera Bloom Boutique Hotel',
				location: 'Nice, France',
				subtitle: '4★ Hotel',
				price: '$135',
				reviews: '9 Reviews',
				image: '/img/banner/header1.svg',
				badge: 'Offer',
			},
			{
				title: 'Mountain Pine Lodge & Spa',
				location: 'Aspen, Colorado',
				subtitle: 'Resort',
				price: '$182',
				reviews: '7 Reviews',
				image: '/img/banner/header3.svg',
				badge: 'New',
			},
			{
				title: 'Skyline Loft Downtown',
				location: 'Tokyo, Japan',
				subtitle: 'Boutique',
				price: '$175',
				reviews: '11 Reviews',
				image: '/img/banner/header2.svg',
			},
			{
				title: 'Coastal Pearl Beach Resort',
				location: 'Bali, Indonesia',
				subtitle: 'Resort',
				price: '$165',
				reviews: '14 Reviews',
				image: '/img/banner/header1.svg',
				badge: 'Featured',
			},
			{
				title: 'Heritage Garden Riad',
				location: 'Marrakech, Morocco',
				subtitle: 'Boutique',
				price: '$98',
				reviews: '6 Reviews',
				image: '/img/banner/header3.svg',
			},
			{
				title: 'Aurora Glass Igloo Retreat',
				location: 'Rovaniemi, Finland',
				subtitle: 'Lodge',
				price: '$245',
				reviews: '5 Reviews',
				image: '/img/banner/header2.svg',
				badge: 'New',
			},
			{
				title: 'Old Town Plaza Hotel',
				location: 'Prague, Czechia',
				subtitle: '4★ Hotel',
				price: '$112',
				reviews: '10 Reviews',
				image: '/img/banner/header1.svg',
			},
		],
	},
	{
		key: 'cars',
		label: 'Popular Cars',
		eyebrow: 'Top Rental Cars',
		headline: 'Drive The Trip Of Your Dreams',
		priceUnit: '/ Day',
		items: [
			{
				title: 'Toyota Corolla Hybrid',
				location: 'Los Angeles, USA',
				subtitle: 'Compact · 5 Seats',
				price: '$48',
				reviews: '13 Reviews',
				image: '/img/banner/header3.svg',
				badge: 'New',
			},
			{
				title: 'BMW 3 Series Sedan',
				location: 'Munich, Germany',
				subtitle: 'Sedan · 5 Seats',
				price: '$92',
				reviews: '8 Reviews',
				image: '/img/banner/header1.svg',
				badge: 'Featured',
			},
			{
				title: 'Tesla Model Y Long Range',
				location: 'San Francisco, USA',
				subtitle: 'Electric SUV',
				price: '$135',
				reviews: '11 Reviews',
				image: '/img/banner/header2.svg',
				badge: 'Offer',
			},
			{
				title: 'Mercedes-Benz V-Class Van',
				location: 'Vienna, Austria',
				subtitle: 'Van · 8 Seats',
				price: '$148',
				reviews: '6 Reviews',
				image: '/img/banner/header3.svg',
			},
			{
				title: 'Jeep Wrangler 4x4',
				location: 'Denver, USA',
				subtitle: 'SUV · Off-road',
				price: '$118',
				reviews: '9 Reviews',
				image: '/img/banner/header1.svg',
				badge: 'Featured',
			},
			{
				title: 'Porsche 911 Carrera',
				location: 'Stuttgart, Germany',
				subtitle: 'Sports Coupe',
				price: '$310',
				reviews: '5 Reviews',
				image: '/img/banner/header2.svg',
				badge: 'New',
			},
			{
				title: 'Range Rover Velar',
				location: 'London, UK',
				subtitle: 'Luxury SUV',
				price: '$172',
				reviews: '7 Reviews',
				image: '/img/banner/header3.svg',
			},
			{
				title: 'Volkswagen Golf GTI',
				location: 'Berlin, Germany',
				subtitle: 'Hatchback',
				price: '$74',
				reviews: '12 Reviews',
				image: '/img/banner/header1.svg',
			},
		],
	},
];

const TourPackages = () => {
	const [activeTab, setActiveTab] = useState<ShowcaseTabKey>('tours');

	const activeShowcase = useMemo(
		() => SHOWCASE_TABS.find((tab) => tab.key === activeTab) ?? SHOWCASE_TABS[0],
		[activeTab],
	);

	return (
		<section className={'tour-packages-section'}>
			<div className={'tour-section-head'}>
				<span>{activeShowcase.eyebrow}</span>
				<h2>{activeShowcase.headline}</h2>
				<div className={'tour-tabs'}>
					{SHOWCASE_TABS.map((tab) => (
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
				{activeShowcase.items.map((item) => (
					<article className={'tour-card'} key={`${activeShowcase.key}-${item.title}`}>
						<div className={'tour-image'}>
							<img src={item.image} alt={item.title} />
							{item.badge && <span className={'tour-badge'}>{item.badge}</span>}
							<button className={'tour-like'} aria-label={`Save ${item.title}`}>
								♡
							</button>
						</div>
						<div className={'tour-info'}>
							<h3>{item.title}</h3>
							<p>{item.location}</p>
							<p>{item.subtitle}</p>
						</div>
						<div className={'tour-bottom'}>
							<strong>
								{item.price} <span>{activeShowcase.priceUnit}</span>
							</strong>
							<em>★ ({item.reviews})</em>
						</div>
					</article>
				))}
			</div>
		</section>
	);
};

export default TourPackages;
