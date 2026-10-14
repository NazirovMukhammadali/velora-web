import React from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import AdminCatalogManager from '../../../libs/components/admin/catalog/AdminCatalogManager';
import { tourConfig } from '../../../libs/components/admin/catalog/catalogConfigs';

const AdminTours: NextPage = () => <AdminCatalogManager config={tourConfig} />;

export default withAdminLayout(AdminTours);
