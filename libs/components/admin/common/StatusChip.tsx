import React from 'react';

type Tone = 'success' | 'warning' | 'danger' | 'muted' | 'primary' | 'accent' | 'info';

const TONES: Record<string, Tone> = {
	ACTIVE: 'success',
	CONFIRMED: 'success',
	PENDING: 'warning',
	HOLD: 'warning',
	CLOSED: 'warning',
	BLOCK: 'danger',
	CANCELLED: 'danger',
	DELETE: 'muted',
	ADMIN: 'accent',
	AGENT: 'primary',
	USER: 'info',
};

const humanize = (value: string) =>
	value
		.toLowerCase()
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

type StatusChipProps = {
	value?: string | null;
	tone?: Tone;
	label?: string;
};

/** Small coloured pill for enum values (statuses, member types, …). */
const StatusChip = ({ value, tone, label }: StatusChipProps) => {
	if (!value) return null;
	return <span className={`va-chip va-chip--${tone ?? TONES[value] ?? 'muted'}`}>{label ?? humanize(value)}</span>;
};

export { humanize };
export default StatusChip;
