import React from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import AdminNoticeManager from '../../../libs/components/admin/cs/AdminNoticeManager';
import { NoticeCategory } from '../../../libs/enums/notice.enum';

const AdminInquiry: NextPage = () => (
	<AdminNoticeManager category={NoticeCategory.INQUIRY} entity="Inquiry" allowCreate={false} />
);

export default withAdminLayout(AdminInquiry);
