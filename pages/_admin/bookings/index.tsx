import React from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import AdminBookingsManager from '../../../libs/components/admin/bookings/AdminBookingsManager';

const AdminBookings: NextPage = () => <AdminBookingsManager />;

export default withAdminLayout(AdminBookings);
