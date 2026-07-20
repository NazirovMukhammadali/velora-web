import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';

export interface Notice {
	_id: string;
	noticeCategory: NoticeCategory;
	noticeStatus: NoticeStatus;
	noticeTitle: string;
	noticeContent: string;
	memberId: string;
	createdAt: Date | string;
	updatedAt: Date | string;
}

export interface Notices {
	list: Notice[];
	metaCounter: Array<{ total?: number }>;
}
