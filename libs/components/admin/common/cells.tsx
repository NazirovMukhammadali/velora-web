import React from 'react';
import Link from 'next/link';
import { Avatar } from '@mui/material';
import VeloraImage from '../../common/VeloraImage';
import { resolvePackageImage } from '../../../data/packageApi';
import { resolveMemberImageUrl } from '../../../utils/memberImage';
import { formatDate } from '../../../utils/date';
import type { Member } from '../../../types/member/member';

const FALLBACK = resolvePackageImage(null);

export const formatMoney = (value?: number | null): string =>
	`$${Number(value ?? 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

export const formatAdminDate = (value?: string | Date | null, pattern = 'dd MMM yyyy'): string =>
	value ? formatDate(value, pattern) : '—';

type ItemCellProps = {
	image?: string | null;
	title: string;
	subtitle?: React.ReactNode;
};

/** Thumbnail + title + muted subtitle, used as the first column of catalog tables. */
export const ItemCell = ({ image, title, subtitle }: ItemCellProps) => (
	<div className="va-item">
		<span className="va-item__thumb">
			<VeloraImage src={resolvePackageImage(image)} fallback={FALLBACK} alt="" width={56} height={56} unoptimized />
		</span>
		<span className="va-item__text">
			<strong title={title}>{title}</strong>
			{subtitle && <small>{subtitle}</small>}
		</span>
	</div>
);

type PersonCellProps = {
	member?: (Pick<Member, '_id'> & Partial<Pick<Member, 'memberNick' | 'memberFullName' | 'memberImage'>>) | null;
	fallback?: string;
};

/** Avatar + name linking to the public member page. */
export const PersonCell = ({ member, fallback = '—' }: PersonCellProps) => {
	if (!member?._id) return <span className="va-muted">{fallback}</span>;
	return (
		<Link href={`/member?memberId=${member._id}`} target="_blank" className="va-person">
			<Avatar src={resolveMemberImageUrl(member.memberImage)} alt="" sx={{ width: 32, height: 32 }} />
			<span>
				<strong>{member.memberFullName || member.memberNick || 'Member'}</strong>
				{member.memberNick && <small>@{member.memberNick}</small>}
			</span>
		</Link>
	);
};
