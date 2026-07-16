import { format, isValid } from 'date-fns';

/** Coerce an ISO string, timestamp, or Date into a valid Date (or null). */
const toDate = (value?: string | number | Date | null): Date | null => {
	if (value === null || value === undefined || value === '') return null;
	const date = value instanceof Date ? value : new Date(value);
	return isValid(date) ? date : null;
};

/**
 * Format a date value with a date-fns pattern, replacing the old react-moment usage.
 * Returns an empty string for missing/invalid input so the UI never shows "Invalid Date".
 *
 * Note: patterns use date-fns (Unicode) tokens — e.g. `dd.MM.yy HH:mm`, `MMMM`, `dd`.
 */
export const formatDate = (value?: string | number | Date | null, pattern = 'dd.MM.yy HH:mm'): string => {
	const date = toDate(value);
	return date ? format(date, pattern) : '';
};

/** Current year as a number (used in footers, copyright lines). */
export const currentYear = (): number => new Date().getFullYear();
