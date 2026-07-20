import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';

export interface NoticesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: number;
	search?: {
		noticeCategory?: NoticeCategory;
		text?: string;
	};
}

export interface InquiryInput {
	noticeTitle: string;
	noticeContent: string;
}

export interface NoticeInput {
	noticeCategory: NoticeCategory;
	noticeTitle: string;
	noticeContent: string;
	noticeStatus?: NoticeStatus;
}
