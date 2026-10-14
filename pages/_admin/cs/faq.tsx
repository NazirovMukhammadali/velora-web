import React from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import AdminNoticeManager from '../../../libs/components/admin/cs/AdminNoticeManager';
import { NoticeCategory } from '../../../libs/enums/notice.enum';

const AdminFaq: NextPage = () => <AdminNoticeManager category={NoticeCategory.FAQ} entity="FAQ" />;

export default withAdminLayout(AdminFaq);
