import React from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface EventData {
	eventTitle: string;
	city: string;
	description: string;
	imageSrc: string;
}
const eventsData: EventData[] = [
	{
		eventTitle: 'Carnival On The Canals',
		city: 'Venice, Italy',
		description:
			'Catch the historical Carnival of Venice with masked balls, gondola parades and street performances along the iconic canals.',
		imageSrc: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&q=80',
	},
	{
		eventTitle: 'Cherry Blossom Festival',
		city: 'Tokyo, Japan',
		description:
			'Walk under blooming sakura tunnels, enjoy hanami picnics and traditional matsuri food across central Tokyo parks.',
		imageSrc: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
	},
	{
		eventTitle: 'Northern Lights Nights',
		city: 'Rovaniemi, Finland',
		description: 'Chase the auroras above snowy fells and warm up in a glass igloo with private guides and reindeer rides.',
		imageSrc: 'https://images.unsplash.com/photo-1551867633-194f125bddfa?auto=format&fit=crop&w=1200&q=80',
	},
	{
		eventTitle: 'Bali Cultural Week',
		city: 'Bali, Indonesia',
		description: 'Sunrise temple ceremonies, beach yoga, traditional dance shows and chef-led food tours in Ubud and Seminyak.',
		imageSrc: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=1200&q=80',
	},
];

const EventCard = ({ event }: { event: EventData }) => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>EVENT CARD</div>;
	} else {
		return (
			<Stack
				className="event-card"
				style={{
					backgroundImage: `url(${event?.imageSrc})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
				}}
			>
				<Box component={'div'} className={'info'}>
					<strong>{event?.city}</strong>
					<span>{event?.eventTitle}</span>
				</Box>
				<Box component={'div'} className={'more'}>
					<span>{event?.description}</span>
				</Box>
			</Stack>
		);
	}
};

const Events = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>EVENT CARD</div>;
	} else {
		return (
			<Stack className={'events'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span className={'white'}>Events</span>
							<p className={'white'}>Events waiting your attention!</p>
						</Box>
					</Stack>
					<Stack className={'card-wrapper'}>
						{eventsData.map((event: EventData) => {
							return <EventCard event={event} key={event?.eventTitle} />;
						})}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Events;
