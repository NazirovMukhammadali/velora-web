import React from 'react';
import {
	AirplaneTilt,
	Buildings,
	CalendarCheck,
	Car,
	ChatsCircle,
	Headset,
	MapTrifold,
	Megaphone,
	Question,
	SquaresFour,
	Users,
} from 'phosphor-react';

export type AdminNavItem = {
	label: string;
	href: string;
	icon: React.ReactNode;
	/** One-line description shown under the page title in the top bar. */
	hint: string;
};

export type AdminNavGroup = { label: string; items: AdminNavItem[] };

const ICON = { size: 20, weight: 'duotone' as const };

export const ADMIN_NAV: AdminNavGroup[] = [
	{
		label: 'Overview',
		items: [
			{
				label: 'Dashboard',
				href: '/_admin',
				icon: <SquaresFour {...ICON} />,
				hint: 'Platform activity at a glance',
			},
		],
	},
	{
		label: 'Catalog',
		items: [
			{ label: 'Tours', href: '/_admin/tours', icon: <MapTrifold {...ICON} />, hint: 'Agent tour packages' },
			{ label: 'Hotels', href: '/_admin/hotels', icon: <Buildings {...ICON} />, hint: 'Stays listed on Velora' },
			{ label: 'Rent a Car', href: '/_admin/rentcars', icon: <Car {...ICON} />, hint: 'Rental fleet and daily rates' },
			{
				label: 'Flights',
				href: '/_admin/flights',
				icon: <AirplaneTilt {...ICON} />,
				hint: 'Routes, schedules and fares',
			},
		],
	},
	{
		label: 'Operations',
		items: [
			{
				label: 'Bookings',
				href: '/_admin/bookings',
				icon: <CalendarCheck {...ICON} />,
				hint: 'Confirm or cancel traveller bookings',
			},
			{ label: 'Members', href: '/_admin/users', icon: <Users {...ICON} />, hint: 'Travellers, agents and admins' },
		],
	},
	{
		label: 'Content & Support',
		items: [
			{
				label: 'Community',
				href: '/_admin/community',
				icon: <ChatsCircle {...ICON} />,
				hint: 'Moderate community articles',
			},
			{
				label: 'Notices',
				href: '/_admin/cs/notice',
				icon: <Megaphone {...ICON} />,
				hint: 'Announcements on the CS page',
			},
			{ label: 'FAQ', href: '/_admin/cs/faq', icon: <Question {...ICON} />, hint: 'Frequently asked questions' },
			{
				label: 'Inquiries',
				href: '/_admin/cs/inquiry',
				icon: <Headset {...ICON} />,
				hint: '1:1 questions from members',
			},
		],
	},
];

/** The nav item that owns `pathname` (longest matching prefix wins; Dashboard only matches exactly). */
export const findAdminNavItem = (pathname: string): AdminNavItem | undefined => {
	const items = ADMIN_NAV.flatMap((group) => group.items);
	return items
		.filter((item) => (item.href === '/_admin' ? pathname === '/_admin' : pathname.startsWith(item.href)))
		.sort((a, b) => b.href.length - a.href.length)[0];
};
