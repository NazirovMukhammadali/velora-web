import React from 'react';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { Avatar, Skeleton } from '@mui/material';
import {
	AirplaneTilt,
	ArrowRight,
	Buildings,
	CalendarCheck,
	Car,
	ChatsCircle,
	Headset,
	MapTrifold,
	UserCircle,
	Users,
} from 'phosphor-react';
import { GET_ADMIN_DASHBOARD } from '../../../../apollo/admin/query';
import { BookingStatus, FlightStatus, HotelStatus, RentcarStatus, TourStatus } from '../../../enums/catalog.enum';
import { MemberType } from '../../../enums/member.enum';
import { NoticeCategory, NoticeStatus } from '../../../enums/notice.enum';
import type { AdminBooking } from '../../../types/admin/catalog';
import type { Member } from '../../../types/member/member';
import { resolveMemberImageUrl } from '../../../utils/memberImage';
import StatusChip from '../common/StatusChip';
import { formatAdminDate, formatMoney } from '../common/cells';

const count = (input: Record<string, unknown> = {}) => ({ page: 1, limit: 1, search: input });

export const DASHBOARD_VARIABLES = {
	members: count(),
	agents: count({ memberType: MemberType.AGENT }),
	tours: count({ tourStatus: TourStatus.ACTIVE }),
	hotels: count({ hotelStatus: HotelStatus.ACTIVE }),
	rentcars: count({ rentcarStatus: RentcarStatus.ACTIVE }),
	flights: count({ flightStatus: FlightStatus.ACTIVE }),
	pendingBookings: count({ bookingStatus: BookingStatus.PENDING }),
	recentBookings: { page: 1, limit: 6, sort: 'createdAt', direction: 'DESC', search: {} },
	articles: count(),
	inquiries: count({ noticeCategory: NoticeCategory.INQUIRY, noticeStatus: NoticeStatus.ACTIVE }),
	recentMembers: { page: 1, limit: 6, sort: 'createdAt', direction: 'DESC', search: {} },
};

type Counter = { metaCounter?: { total: number }[] } | null | undefined;
const totalOf = (counter: Counter) => counter?.metaCounter?.[0]?.total ?? 0;

type StatCard = {
	key: string;
	label: string;
	href: string;
	icon: React.ReactNode;
	tone: 'primary' | 'accent' | 'success' | 'info' | 'warning';
	note?: string;
};

const CATALOG_CARDS: StatCard[] = [
	{
		key: 'tours',
		label: 'Active tours',
		href: '/_admin/tours',
		icon: <MapTrifold size={22} weight="duotone" />,
		tone: 'primary',
	},
	{
		key: 'hotels',
		label: 'Active hotels',
		href: '/_admin/hotels',
		icon: <Buildings size={22} weight="duotone" />,
		tone: 'info',
	},
	{
		key: 'rentcars',
		label: 'Cars for rent',
		href: '/_admin/rentcars',
		icon: <Car size={22} weight="duotone" />,
		tone: 'accent',
	},
	{
		key: 'flights',
		label: 'Scheduled flights',
		href: '/_admin/flights',
		icon: <AirplaneTilt size={22} weight="duotone" />,
		tone: 'success',
	},
];

const ACTIVITY_CARDS: StatCard[] = [
	{
		key: 'pendingBookings',
		label: 'Bookings to review',
		href: '/_admin/bookings',
		icon: <CalendarCheck size={22} weight="duotone" />,
		tone: 'warning',
		note: 'Pending confirmation',
	},
	{
		key: 'members',
		label: 'Members',
		href: '/_admin/users',
		icon: <Users size={22} weight="duotone" />,
		tone: 'primary',
	},
	{
		key: 'agents',
		label: 'Travel agents',
		href: '/_admin/users',
		icon: <UserCircle size={22} weight="duotone" />,
		tone: 'info',
	},
	{
		key: 'articles',
		label: 'Community articles',
		href: '/_admin/community',
		icon: <ChatsCircle size={22} weight="duotone" />,
		tone: 'success',
	},
	{
		key: 'inquiries',
		label: 'Open inquiries',
		href: '/_admin/cs/inquiry',
		icon: <Headset size={22} weight="duotone" />,
		tone: 'accent',
		note: 'Awaiting a reply',
	},
];

const AdminDashboard = () => {
	const { data, loading, error } = useQuery(GET_ADMIN_DASHBOARD, {
		fetchPolicy: 'network-only',
		variables: DASHBOARD_VARIABLES,
		errorPolicy: 'all',
	});

	const renderCard = (card: StatCard) => (
		<Link key={card.key} href={card.href} className={`va-stat va-stat--${card.tone}`}>
			<span className="va-stat__icon">{card.icon}</span>
			<span className="va-stat__body">
				<small>{card.label}</small>
				{loading && !data ? <Skeleton width={48} height={34} /> : <strong>{totalOf(data?.[card.key])}</strong>}
				{card.note && <em>{card.note}</em>}
			</span>
		</Link>
	);

	const recentBookings: AdminBooking[] = data?.recentBookings?.list ?? [];
	const recentMembers: Member[] = data?.recentMembers?.list ?? [];

	return (
		<div className="va-dashboard">
			<section className="va-welcome">
				<div>
					<h2>Welcome back 👋</h2>
					<p>
						Keep the Velora catalog fresh and reply to travellers quickly — here is what needs your attention today.
					</p>
				</div>
				<Link href="/_admin/bookings" className="va-welcome__cta">
					Review bookings <ArrowRight size={18} weight="bold" />
				</Link>
			</section>

			{error && !data && <p className="va-alert">Could not load dashboard data: {error.message}</p>}

			<h3 className="va-section-title">Catalog</h3>
			<div className="va-stats">{CATALOG_CARDS.map(renderCard)}</div>

			<h3 className="va-section-title">Activity</h3>
			<div className="va-stats va-stats--five">{ACTIVITY_CARDS.map(renderCard)}</div>

			<div className="va-dashboard__grid">
				<section className="va-card va-panel">
					<header className="va-panel__head">
						<h3>Latest bookings</h3>
						<Link href="/_admin/bookings">View all</Link>
					</header>
					{recentBookings.length === 0 && !loading && <p className="va-muted va-panel__empty">No bookings yet.</p>}
					<ul className="va-feed">
						{recentBookings.map((booking) => (
							<li key={booking._id}>
								<Avatar
									src={resolveMemberImageUrl(booking.memberData?.memberImage)}
									alt=""
									sx={{ width: 36, height: 36 }}
								/>
								<div className="va-feed__text">
									<strong>{booking.bookingTitle}</strong>
									<small>
										{booking.memberData?.memberNick ?? 'Traveller'} ·{' '}
										{formatAdminDate(booking.createdAt, 'dd MMM, HH:mm')}
									</small>
								</div>
								<span className="va-feed__meta">
									<strong>{formatMoney(booking.bookingPrice)}</strong>
									<StatusChip value={booking.bookingStatus} />
								</span>
							</li>
						))}
					</ul>
				</section>

				<section className="va-card va-panel">
					<header className="va-panel__head">
						<h3>New members</h3>
						<Link href="/_admin/users">View all</Link>
					</header>
					<ul className="va-feed">
						{recentMembers.map((member) => (
							<li key={member._id}>
								<Avatar src={resolveMemberImageUrl(member.memberImage)} alt="" sx={{ width: 36, height: 36 }} />
								<div className="va-feed__text">
									<strong>{member.memberFullName || member.memberNick}</strong>
									<small>
										@{member.memberNick} · {formatAdminDate(member.createdAt)}
									</small>
								</div>
								<span className="va-feed__meta">
									<StatusChip value={member.memberType} />
								</span>
							</li>
						))}
					</ul>
				</section>
			</div>
		</div>
	);
};

export default AdminDashboard;
