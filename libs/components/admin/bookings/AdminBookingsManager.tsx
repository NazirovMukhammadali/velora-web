import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Button, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import { CheckCircle, XCircle } from 'phosphor-react';
import AdminListCard from '../common/AdminListCard';
import StatusChip, { humanize } from '../common/StatusChip';
import { ALL_TAB, useAdminInquiry } from '../common/useAdminInquiry';
import { PersonCell, formatAdminDate, formatMoney } from '../common/cells';
import { GET_ALL_BOOKINGS_BY_ADMIN } from '../../../../apollo/admin/query';
import {
	CANCEL_HOTEL_BOOKING_BY_ADMIN,
	CANCEL_TOUR_BOOKING_BY_ADMIN,
	CONFIRM_HOTEL_BOOKING_BY_ADMIN,
	CONFIRM_TOUR_BOOKING_BY_ADMIN,
} from '../../../../apollo/admin/mutation';
import { BookingStatus, BookingType } from '../../../enums/catalog.enum';
import type { AdminBooking, ListResult } from '../../../types/admin/catalog';
import { sweetConfirmAlert, sweetErrorHandlingForAdmin, sweetTopSmallSuccessAlert } from '../../../sweetAlert';

/** Only tour and hotel bookings are stored server-side (flights / cars stay in the traveller's browser). */
const MANAGED_TYPES = [BookingType.TOUR, BookingType.HOTEL];

const STATUS_TABS = [
	{ value: ALL_TAB, label: 'All' },
	{ value: BookingStatus.PENDING, label: 'Pending' },
	{ value: BookingStatus.CONFIRMED, label: 'Confirmed' },
	{ value: BookingStatus.CANCELLED, label: 'Cancelled' },
];

const bookingDates = (booking: AdminBooking): string => {
	if (booking.checkInDate && booking.checkOutDate) {
		return `${formatAdminDate(booking.checkInDate, 'dd MMM')} – ${formatAdminDate(
			booking.checkOutDate,
			'dd MMM yyyy',
		)}`;
	}
	return '—';
};

const AdminBookingsManager = () => {
	const inquiry = useAdminInquiry(
		({ tab, text, filters }) => ({
			...(tab !== ALL_TAB ? { bookingStatus: tab } : {}),
			...(filters.type !== ALL_TAB ? { bookingType: filters.type } : {}),
			...(text ? { text } : {}),
		}),
		{ type: ALL_TAB },
	);

	const { data, loading, refetch } = useQuery(GET_ALL_BOOKINGS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		notifyOnNetworkStatusChange: true,
		variables: { input: inquiry.input },
	});
	const [confirmTour] = useMutation(CONFIRM_TOUR_BOOKING_BY_ADMIN);
	const [cancelTour] = useMutation(CANCEL_TOUR_BOOKING_BY_ADMIN);
	const [confirmHotel] = useMutation(CONFIRM_HOTEL_BOOKING_BY_ADMIN);
	const [cancelHotel] = useMutation(CANCEL_HOTEL_BOOKING_BY_ADMIN);
	const [busyId, setBusyId] = useState<string | null>(null);

	const result: ListResult<AdminBooking> | undefined = data?.getAllBookingsByAdmin;
	const bookings = result?.list ?? [];
	const total = result?.metaCounter?.[0]?.total ?? 0;

	/** HANDLERS **/
	const act = async (booking: AdminBooking, action: 'confirm' | 'cancel') => {
		const verb = action === 'confirm' ? 'Confirm' : 'Cancel';
		if (!(await sweetConfirmAlert(`${verb} booking “${booking.bookingTitle}”?`))) return;
		setBusyId(booking._id);
		try {
			const variables = { input: { _id: booking._id } };
			if (booking.bookingType === BookingType.TOUR) {
				await (action === 'confirm' ? confirmTour({ variables }) : cancelTour({ variables }));
			} else {
				await (action === 'confirm' ? confirmHotel({ variables }) : cancelHotel({ variables }));
			}
			await refetch();
			sweetTopSmallSuccessAlert(action === 'confirm' ? 'Booking confirmed' : 'Booking cancelled', 900).then();
		} catch (err) {
			sweetErrorHandlingForAdmin(err).then();
		} finally {
			setBusyId(null);
		}
	};

	return (
		<AdminListCard
			inquiry={inquiry}
			tabs={STATUS_TABS}
			total={total}
			loading={loading}
			searchPlaceholder="Search by tour or hotel name"
			filters={
				<TextField
					select
					size="small"
					label="Type"
					value={inquiry.filters.type}
					onChange={(e) => inquiry.setFilter('type', e.target.value)}
					className="va-toolbar__filter"
				>
					<MenuItem value={ALL_TAB}>All</MenuItem>
					{MANAGED_TYPES.map((type) => (
						<MenuItem key={type} value={type}>
							{humanize(type)}
						</MenuItem>
					))}
				</TextField>
			}
		>
			<Table className="va-table">
				<TableHead>
					<TableRow>
						<TableCell>Booking</TableCell>
						<TableCell>Traveller</TableCell>
						<TableCell>Stay dates</TableCell>
						<TableCell align="right">Amount</TableCell>
						<TableCell>Booked on</TableCell>
						<TableCell align="center">Status</TableCell>
						<TableCell align="right">Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{!loading && bookings.length === 0 && (
						<TableRow>
							<TableCell colSpan={7} className="va-table__empty">
								No bookings match these filters.
							</TableCell>
						</TableRow>
					)}
					{bookings.map((booking) => {
						const manageable = MANAGED_TYPES.includes(booking.bookingType);
						const pending = booking.bookingStatus === BookingStatus.PENDING;
						const cancellable = pending || booking.bookingStatus === BookingStatus.CONFIRMED;
						const busy = busyId === booking._id;
						return (
							<TableRow hover key={booking._id}>
								<TableCell>
									<div className="va-route">
										<strong>{booking.bookingTitle}</strong>
										<small>
											<StatusChip value={booking.bookingType} tone="primary" />
											{booking.quantity && booking.quantity > 1 ? ` · ${booking.quantity} rooms` : ''}
										</small>
									</div>
								</TableCell>
								<TableCell>
									<PersonCell member={booking.memberData} />
								</TableCell>
								<TableCell>{bookingDates(booking)}</TableCell>
								<TableCell align="right">
									<strong>{formatMoney(booking.bookingPrice)}</strong>
								</TableCell>
								<TableCell>{formatAdminDate(booking.createdAt, 'dd MMM yyyy, HH:mm')}</TableCell>
								<TableCell align="center">
									<StatusChip value={booking.bookingStatus} />
								</TableCell>
								<TableCell align="right" className="va-table__actions">
									{manageable && pending && (
										<Button
											size="small"
											variant="contained"
											color="success"
											startIcon={<CheckCircle size={16} />}
											disabled={busy}
											onClick={() => void act(booking, 'confirm')}
										>
											Confirm
										</Button>
									)}
									{manageable && cancellable && (
										<Button
											size="small"
											variant="outlined"
											color="error"
											startIcon={<XCircle size={16} />}
											disabled={busy}
											onClick={() => void act(booking, 'cancel')}
										>
											Cancel
										</Button>
									)}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</AdminListCard>
	);
};

export default AdminBookingsManager;
