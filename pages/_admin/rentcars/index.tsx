import React from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import AdminCatalogManager from '../../../libs/components/admin/catalog/AdminCatalogManager';
import { rentcarConfig } from '../../../libs/components/admin/catalog/catalogConfigs';

const AdminRentcars: NextPage = () => <AdminCatalogManager config={rentcarConfig} />;

export default withAdminLayout(AdminRentcars);
