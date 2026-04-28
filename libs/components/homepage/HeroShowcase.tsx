import React, { useEffect, useMemo, useState } from 'react';

type HeroSlide = {
	id: string;
	title: string;
	subtitle: string;
	priceLabel: string;
	image: string;
};

const slides: HeroSlide[] = [
	{
		id: 'amalfi',
		title: 'Amalfi Coast Escape',
		subtitle: 'Curated premium travel routes with flexible bookings',
		priceLabel: '$329 / night',
		image: '/img/banner/header1.svg',
	},
	{
		id: 'alps',
		title: 'Swiss Alps Journey',
		subtitle: 'Mountain adventures and comfort stays in one flow',
		priceLabel: '$289 / night',
		image: '/img/banner/header2.svg',
	},
	{
		id: 'santorini',
		title: 'Santorini Summer',
		subtitle: 'Romantic island views with trusted local guides',
		priceLabel: '$349 / night',
		image: '/img/banner/header3.svg',
	},
];

const AUTO_ROTATE_MS = 6000;

const HeroShowcase = () => {
	const [activeIndex, setActiveIndex] = useState(0);
	const activeSlide = useMemo(() => slides[activeIndex], [activeIndex]);

	useEffect(() => {
		const timer = window.setInterval(() => {
			setActiveIndex((prev) => (prev + 1) % slides.length);
		}, AUTO_ROTATE_MS);

		return () => window.clearInterval(timer);
	}, []);

	const next = () => setActiveIndex((prev) => (prev + 1) % slides.length);
	const prev = () => setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);

	return (
		<div className="hero-showcase">
			<div className="hero-background" style={{ backgroundImage: `url(${activeSlide.image})` }} />
			<div className="hero-overlay" />

			<div className="hero-content">
				<p className="hero-kicker">Velora curated travel</p>
				<h1 className="hero-title">{activeSlide.title}</h1>
				<p className="hero-subtitle">{activeSlide.subtitle}</p>
				<p className="hero-price">
					Booking starts from <strong>{activeSlide.priceLabel}</strong>
				</p>
				<button className="hero-cta">Take a tour</button>
			</div>

			<div className="hero-controls">
				<button className="hero-nav-btn" onClick={prev} aria-label="Previous slide">
					&#8592;
				</button>
				<button className="hero-nav-btn" onClick={next} aria-label="Next slide">
					&#8594;
				</button>
			</div>
		</div>
	);
};

export default HeroShowcase;
