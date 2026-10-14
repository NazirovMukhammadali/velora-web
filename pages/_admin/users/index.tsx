import React from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import AdminMembersManager from '../../../libs/components/admin/users/AdminMembersManager';

const AdminUsers: NextPage = () => <AdminMembersManager />;

export default withAdminLayout(AdminUsers);
