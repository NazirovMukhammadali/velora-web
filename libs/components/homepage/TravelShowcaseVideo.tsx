import React from 'react';

const TravelShowcaseVideo = () => {
	return (
		<section className={'travel-showcase-video-section'}>
			<div className={'video-shell'}>
				<video autoPlay muted loop playsInline preload={'auto'} aria-label={'Velora travel showcase video'}>
					<source src={'/video/VID_20260618_003716_349.mp4'} type={'video/mp4'} />
				</video>
			</div>
		</section>
	);
};

export default TravelShowcaseVideo;
