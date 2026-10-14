import React from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import AdminCatalogManager from '../../../libs/components/admin/catalog/AdminCatalogManager';
import { flightConfig } from '../../../libs/components/admin/catalog/catalogConfigs';

const AdminFlights: NextPage = () => <AdminCatalogManager config={flightConfig} />;

export default withAdminLayout(AdminFlights);
