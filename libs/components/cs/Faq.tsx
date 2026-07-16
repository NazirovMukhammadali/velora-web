import React, { SyntheticEvent, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { AccordionDetails, Box, Stack, Typography } from '@mui/material';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

type FaqCategory = 'booking' | 'payment' | 'staysTours' | 'flights' | 'cancellations' | 'other';

interface FaqItem {
	id: string;
	subject: string;
	content: string;
}

const FAQ_TABS: { key: FaqCategory; label: string }[] = [
	{ key: 'booking', label: 'Booking' },
	{ key: 'payment', label: 'Payment' },
	{ key: 'staysTours', label: 'Tours & Hotels' },
	{ key: 'flights', label: 'Flights' },
	{ key: 'cancellations', label: 'Cancellations' },
	{ key: 'other', label: 'Other' },
];

const FAQ_DATA: Record<FaqCategory, FaqItem[]> = {
	booking: [
		{
			id: 'booking-01',
			subject: 'How do I book a trip on Velora?',
			content:
				'Search for flights, hotels, tours, or rental cars, open any result for full details, then use the booking panel to pick your dates and confirm. You can review everything before payment.',
		},
		{
			id: 'booking-02',
			subject: 'Do I need an account to make a booking?',
			content:
				'You can browse freely, but you need to sign in to confirm a booking so we can attach it to your profile and send confirmations.',
		},
		{
			id: 'booking-03',
			subject: 'Where can I see my current bookings?',
			content:
				'All of your tour, hotel, car, and flight bookings appear under My Bookings, where you can track their status at a glance.',
		},
		{
			id: 'booking-04',
			subject: 'Can I book for multiple travelers at once?',
			content:
				'Yes. During checkout you can set the number of travelers or passengers, and the total price updates automatically.',
		},
		{
			id: 'booking-05',
			subject: 'Will I receive a confirmation after booking?',
			content:
				'Once a booking is confirmed you will see it instantly in My Bookings and receive a confirmation with all the key details.',
		},
	],
	payment: [
		{
			id: 'payment-01',
			subject: 'Which payment methods does Velora accept?',
			content:
				'We support major credit and debit cards. Your payment details are encrypted and processed securely at checkout.',
		},
		{
			id: 'payment-02',
			subject: 'Is my payment information secure?',
			content:
				'Yes. We use industry-standard encryption and never store raw card details on our servers.',
		},
		{
			id: 'payment-03',
			subject: 'Are there any hidden booking fees?',
			content:
				'No. The price you see includes Velora service fees. Any optional extras are shown clearly before you confirm.',
		},
		{
			id: 'payment-04',
			subject: 'Can I pay in installments?',
			content:
				'Installment options are available on selected tour packages. When eligible, the option appears on the booking panel.',
		},
		{
			id: 'payment-05',
			subject: 'When am I charged for my booking?',
			content:
				'Most bookings are charged at the time of confirmation. Pay-at-property stays and special fares note their terms before checkout.',
		},
	],
	staysTours: [
		{
			id: 'stays-01',
			subject: 'Are airport transfers included in hotel bookings?',
			content:
				'Transfers depend on the property. Any included transfer or shuttle is listed under the hotel’s “What’s included” section on the detail page.',
		},
		{
			id: 'stays-02',
			subject: 'What is the cancellation policy for tour packages?',
			content:
				'Most tours offer free cancellation up to a set window before departure. The exact policy is shown on each tour’s detail page before you book.',
		},
		{
			id: 'stays-03',
			subject: 'Can I request special arrangements for a tour?',
			content:
				'Yes. Many tours allow notes for dietary needs, accessibility, or group requests. Add them during booking and our travel experts follow up.',
		},
		{
			id: 'stays-04',
			subject: 'Do hotel prices include taxes?',
			content:
				'Displayed nightly rates include applicable taxes and fees. Any local resort or city tax payable at the property is noted on the detail page.',
		},
		{
			id: 'stays-05',
			subject: 'How are tour guides and hotels verified?',
			content:
				'We work with vetted travel experts and verified properties, and we surface real ratings and reviews so you can compare with confidence.',
		},
	],
	flights: [
		{
			id: 'flights-01',
			subject: 'How do I change my flight booking?',
			content:
				'Open the flight in My Bookings to see whether your fare allows changes. For changeable fares you can request a new date subject to fare rules.',
		},
		{
			id: 'flights-02',
			subject: 'Is baggage included in the fare?',
			content:
				'Each flight lists its baggage allowance on the detail page. Cabin and checked baggage rules vary by airline and fare class.',
		},
		{
			id: 'flights-03',
			subject: 'Can I choose my seat?',
			content:
				'Seat selection is available during booking for most airlines, and may carry an additional fee depending on the fare.',
		},
		{
			id: 'flights-04',
			subject: 'What does a “Nonstop” flight mean?',
			content:
				'Nonstop flights fly directly with no connections. Flights with stops show the number of stops clearly on the flight card.',
		},
		{
			id: 'flights-05',
			subject: 'When should I arrive at the airport?',
			content:
				'We recommend arriving at least 2 hours before domestic departures and 3 hours before international flights.',
		},
	],
	cancellations: [
		{
			id: 'cancel-01',
			subject: 'How do I cancel a booking?',
			content:
				'Go to My Bookings, open the booking you want to cancel, and follow the cancellation steps. Eligibility depends on each item’s policy.',
		},
		{
			id: 'cancel-02',
			subject: 'Will I get a refund if I cancel?',
			content:
				'Refunds depend on the fare or rate type. Free-cancellation bookings are fully refundable within their window; non-refundable rates are noted before you book.',
		},
		{
			id: 'cancel-03',
			subject: 'How long do refunds take to process?',
			content:
				'Approved refunds are typically returned to your original payment method within a few business days, depending on your bank.',
		},
		{
			id: 'cancel-04',
			subject: 'Can I cancel just one part of a multi-item trip?',
			content:
				'Yes. Each booking (flight, hotel, tour, or car) is managed separately, so you can cancel one without affecting the others.',
		},
		{
			id: 'cancel-05',
			subject: 'What happens if my flight is cancelled by the airline?',
			content:
				'If an airline cancels your flight, you are entitled to a rebooking or refund per the airline’s policy. Our support team helps you arrange it.',
		},
	],
	other: [
		{
			id: 'other-01',
			subject: 'How can I contact Velora support?',
			content:
				'You can reach our 24/7 support team using the live chat widget or the contact details in the footer. We’re happy to help with any trip.',
		},
		{
			id: 'other-02',
			subject: 'Which languages does Velora support?',
			content:
				'Velora is available in English, Korean, and Russian. Switch languages anytime from the flag menu in the navigation bar.',
		},
		{
			id: 'other-03',
			subject: 'How do I save trips I’m interested in?',
			content:
				'Tap the heart icon on any tour, hotel, or car card to save it to your favorites so you can compare and book later.',
		},
		{
			id: 'other-04',
			subject: 'Can I work with a travel expert directly?',
			content:
				'Yes. Browse our Agents directory to compare certified travel experts by rating and experience, then connect with the one you trust.',
		},
		{
			id: 'other-05',
			subject: 'Does Velora have a mobile experience?',
			content:
				'Velora is fully responsive, so you can search, compare, and book across desktop, tablet, and mobile devices.',
		},
	],
};

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
	({ theme }) => ({
		border: `1px solid ${theme.palette.divider}`,
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&:before': {
			display: 'none',
		},
	}),
);
const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.4rem' }} />} {...props} />
))(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : '#fff',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(180deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

const Faq = () => {
	const device = useDeviceDetect();
	const [category, setCategory] = useState<FaqCategory>('booking');
	const [expanded, setExpanded] = useState<string | false>(FAQ_DATA.booking[0]?.id ?? false);

	/** HANDLERS **/
	const changeCategoryHandler = (next: FaqCategory) => {
		setCategory(next);
		setExpanded(FAQ_DATA[next][0]?.id ?? false);
	};

	const handleChange = (panel: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
		setExpanded(isExpanded ? panel : false);
	};

	if (device === 'mobile') {
		return <div>FAQ MOBILE</div>;
	}

	return (
		<Stack className={'faq-content'}>
			<Box className={'categories'} component={'div'}>
				{FAQ_TABS.map((tab) => (
					<div
						key={tab.key}
						className={category === tab.key ? 'active' : ''}
						onClick={() => changeCategoryHandler(tab.key)}
					>
						{tab.label}
					</div>
				))}
			</Box>
			<Box className={'wrap'} component={'div'}>
				{FAQ_DATA[category].map((ele) => (
					<Accordion expanded={expanded === ele.id} onChange={handleChange(ele.id)} key={ele.id}>
						<AccordionSummary id={`${ele.id}-header`} className="question" aria-controls={`${ele.id}-content`}>
							<Typography className="badge" variant={'h4'}>
								Q
							</Typography>
							<Typography>{ele.subject}</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Stack className={'answer flex-box'}>
								<Typography className="badge" variant={'h4'} color={'primary'}>
									A
								</Typography>
								<Typography>{ele.content}</Typography>
							</Stack>
						</AccordionDetails>
					</Accordion>
				))}
			</Box>
		</Stack>
	);
};

export default Faq;
