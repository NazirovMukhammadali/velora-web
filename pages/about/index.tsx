import React from 'react';
import { NextPage } from 'next';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box } from '@mui/material';

const About: NextPage = () => {
	return (
		<Stack className={'about-page'}>
			<Stack className={'intro'}>
				<Stack className={'container'}>
					<Stack className={'left'}>
						<strong>We’re on a mission to make travel simple, transparent, and unforgettable.</strong>
					</Stack>
					<Stack className={'right'}>
						<p>
							Velora brings tours, hotels, flights, and car rentals together in one place — with clear pricing,
							verified local experts, and flexible add-ons. No hidden fees, no guesswork.
							<br />
							<br />
							From a weekend city break to a multi-week adventure, our team curates experiences that put comfort and
							value first, so you can focus on the journey instead of the logistics.
						</p>
						<Stack className={'boxes'}>
							<div className={'box'}>
								<div>
									<img src="/img/icons/garden.svg" alt="" />
								</div>
								<span>Curated experiences</span>
								<p>Hand-picked tours and stays in every destination.</p>
							</div>
							<div className={'box'}>
								<div>
									<img src="/img/icons/securePayment.svg" alt="" />
								</div>
								<span>Secure payment</span>
								<p>Book with confidence using protected checkout.</p>
							</div>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
			<Stack className={'statistics'}>
				<Stack className={'container'}>
					<Stack className={'banner'}>
						<img
							src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80"
							alt=""
						/>
					</Stack>
					<Stack className={'info'}>
						<Box component={'div'}>
							<strong>120K</strong>
							<p>Happy Travelers</p>
						</Box>
						<Box component={'div'}>
							<strong>850+</strong>
							<p>Destinations</p>
						</Box>
						<Box component={'div'}>
							<strong>4.9</strong>
							<p>Average Rating</p>
						</Box>
					</Stack>
				</Stack>
			</Stack>
			<Stack className={'options'}>
				<img
					src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80"
					alt=""
					className={'about-banner'}
				/>
				<Stack className={'container'}>
					<strong>Why travelers choose Velora</strong>
					<Stack>
						<div className={'icon-box'}>
							<img src="/img/icons/security.svg" alt="" />
						</div>
						<div className={'text-box'}>
							<span>Best-price guarantee</span>
							<p>Transparent pricing with no hidden fees — what you see is what you pay.</p>
						</div>
					</Stack>
					<Stack>
						<div className={'icon-box'}>
							<img src="/img/icons/keywording.svg" alt="" />
						</div>
						<div className={'text-box'}>
							<span>Verified local experts</span>
							<p>Travel guides and agents reviewed by our team and real travelers.</p>
						</div>
					</Stack>
					<Stack>
						<div className={'icon-box'}>
							<img src="/img/icons/investment.svg" alt="" />
						</div>
						<div className={'text-box'}>
							<span>24/7 support</span>
							<p>Help before and during your trip, whenever you need it.</p>
						</div>
					</Stack>
				</Stack>
			</Stack>
			<Stack className={'partners'}>
				<Stack className={'container'}>
					<span>Trusted by leading travel brands</span>
					<Stack className={'wrap partners-text'}>
						<strong>Booking.com</strong>
						<strong>Airbnb</strong>
						<strong>Expedia</strong>
						<strong>Trip.com</strong>
						<strong>Agoda</strong>
					</Stack>
				</Stack>
			</Stack>
			<Stack className={'help'}>
				<Stack className={'container'}>
					<Box component={'div'} className={'left'}>
						<strong>Need help planning your trip?</strong>
						<p>Talk to our travel experts or browse tours, hotels, and more.</p>
					</Box>
					<Box component={'div'} className={'right'}>
						<div className={'white'}>
							Contact Us
							<img src="/img/icons/rightup.svg" alt="" />
						</div>
						<div className={'black'}>
							<img src="/img/icons/call.svg" alt="" />
							920 851 9087
						</div>
					</Box>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(About);
