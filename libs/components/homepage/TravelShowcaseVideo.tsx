import React from 'react';

const TravelShowcaseVideo = () => {
	return (
		<section className={'travel-showcase-video-section'}>
			<div className={'video-shell'}>
				<video autoPlay muted loop playsInline preload={'metadata'} aria-label={'Hotel arrival showcase video'}>
					<source src={'/video/velora-arrival-30s-1080.mp4'} type={'video/mp4'} />
				</video>
			</div>
		</section>
	);
};

export default TravelShowcaseVideo;
