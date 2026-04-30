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
				title: 'Romantic Gondolas And Hidden Canals',
				location: 'Venice, Italy',
				subtitle: '7 Days',
				price: '$320',
				reviews: '5 Reviews',
				image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=900&q=80',
				badge: 'New',
			},
			{
				title: 'When You Visit The Eternal Dubai City',
				location: 'Dubai, Emirates',
				subtitle: '2 Days',
				price: '$149',
				reviews: '6 Reviews',
				image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80',
				badge: 'Offer',
			},
			{
				title: 'Phi Phi Islands Speedboat Adventure',
				location: 'Phuket, Thailand',
				subtitle: '5 Days',
				price: '$349',
				reviews: '6 Reviews',
				image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=900&q=80',
				badge: 'New',
			},
			{
				title: 'Manhattan Skyline And Liberty Cruise',
				location: 'New York, USA',
				subtitle: '3 Days',
				price: '$255',
				reviews: '4 Reviews',
				image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=900&q=80',
				badge: 'Featured',
			},
			{
				title: 'Swiss Alps Panorama Train Journey',
				location: 'Zermatt, Switzerland',
				subtitle: '6 Days',
				price: '$289',
				reviews: '7 Reviews',
				image: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=900&q=80',
			},
			{
				title: 'Northern Fjords And Aurora Lights',
				location: 'Bergen, Norway',
				subtitle: '4 Days',
				price: '$199',
				reviews: '8 Reviews',
				image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=80',
				badge: 'Featured',
			},
			{
				title: 'Vatican Museums And Sistine Chapel Tour',
				location: 'Rome, Italy',
				subtitle: '1 Day',
				price: '$119',
				reviews: '9 Reviews',
				image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80',
			},
			{
				title: 'Sydney Harbour And Opera House Sail',
				location: 'Sydney, Australia',
				subtitle: '3 Days',
				price: '$255',
				reviews: '4 Reviews',
				image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=900&q=80',
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
				image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=900&q=80',
				badge: 'Featured',
			},
			{
				title: 'Riviera Bloom Boutique Hotel',
				location: 'Nice, France',
				subtitle: '4★ Hotel',
				price: '$135',
				reviews: '9 Reviews',
				image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80',
				badge: 'Offer',
			},
			{
				title: 'Mountain Pine Lodge & Spa',
				location: 'Aspen, Colorado',
				subtitle: 'Resort',
				price: '$182',
				reviews: '7 Reviews',
				image: 'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=900&q=80',
				badge: 'New',
			},
			{
				title: 'Skyline Loft Downtown',
				location: 'Tokyo, Japan',
				subtitle: 'Boutique',
				price: '$175',
				reviews: '11 Reviews',
				image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80',
			},
			{
				title: 'Coastal Pearl Beach Resort',
				location: 'Bali, Indonesia',
				subtitle: 'Resort',
				price: '$165',
				reviews: '14 Reviews',
				image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=900&q=80',
				badge: 'Featured',
			},
			{
				title: 'Heritage Garden Riad',
				location: 'Marrakech, Morocco',
				subtitle: 'Boutique',
				price: '$98',
				reviews: '6 Reviews',
				image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=900&q=80',
			},
			{
				title: 'Aurora Glass Igloo Retreat',
				location: 'Rovaniemi, Finland',
				subtitle: 'Lodge',
				price: '$245',
				reviews: '5 Reviews',
				image: 'https://images.unsplash.com/photo-1551867633-194f125bddfa?auto=format&fit=crop&w=900&q=80',
				badge: 'New',
			},
			{
				title: 'Old Town Plaza Hotel',
				location: 'Prague, Czechia',
				subtitle: '4★ Hotel',
				price: '$112',
				reviews: '10 Reviews',
				image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80',
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
				image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=80',
				badge: 'New',
			},
			{
				title: 'BMW 3 Series Sedan',
				location: 'Munich, Germany',
				subtitle: 'Sedan · 5 Seats',
				price: '$92',
				reviews: '8 Reviews',
				image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80',
				badge: 'Featured',
			},
			{
				title: 'Tesla Model Y Long Range',
				location: 'San Francisco, USA',
				subtitle: 'Electric SUV',
				price: '$135',
				reviews: '11 Reviews',
				image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=80',
				badge: 'Offer',
			},
			{
				title: 'Mercedes-Benz V-Class Van',
				location: 'Vienna, Austria',
				subtitle: 'Van · 8 Seats',
				price: '$148',
				reviews: '6 Reviews',
				image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80',
			},
			{
				title: 'Jeep Wrangler 4x4',
				location: 'Denver, USA',
				subtitle: 'SUV · Off-road',
				price: '$118',
				reviews: '9 Reviews',
				image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',
				badge: 'Featured',
			},
			{
				title: 'Porsche 911 Carrera',
				location: 'Stuttgart, Germany',
				subtitle: 'Sports Coupe',
				price: '$310',
				reviews: '5 Reviews',
				image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
				badge: 'New',
			},
			{
				title: 'Range Rover Velar',
				location: 'London, UK',
				subtitle: 'Luxury SUV',
				price: '$172',
				reviews: '7 Reviews',
				image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80',
			},
			{
				title: 'Volkswagen Golf GTI',
				location: 'Berlin, Germany',
				subtitle: 'Hatchback',
				price: '$74',
				reviews: '12 Reviews',
				image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=900&q=80',
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
