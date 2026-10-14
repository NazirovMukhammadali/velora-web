import React from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import AdminCatalogManager from '../../../libs/components/admin/catalog/AdminCatalogManager';
import { hotelConfig } from '../../../libs/components/admin/catalog/catalogConfigs';

const AdminHotels: NextPage = () => <AdminCatalogManager config={hotelConfig} />;

export default withAdminLayout(AdminHotels);
