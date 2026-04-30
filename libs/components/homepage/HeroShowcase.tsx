import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

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
		image: 'https://images.unsplash.com/photo-1533165850316-2d4ff4f0a4d4?auto=format&fit=crop&w=1600&q=80',
	},
	{
		id: 'alps',
		title: 'Swiss Alps Journey',
		subtitle: 'Mountain adventures and comfort stays in one flow',
		priceLabel: '$289 / night',
		image: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=1600&q=80',
	},
	{
		id: 'santorini',
		title: 'Santorini Summer',
		subtitle: 'Romantic island views with trusted local guides',
		priceLabel: '$349 / night',
		image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=80',
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
				<Link href="/tours" className="hero-cta">
					Take a tour
				</Link>
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
