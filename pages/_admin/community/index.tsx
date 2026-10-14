import React from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import AdminArticlesManager from '../../../libs/components/admin/community/AdminArticlesManager';

const AdminCommunity: NextPage = () => <AdminArticlesManager />;

export default withAdminLayout(AdminCommunity);
