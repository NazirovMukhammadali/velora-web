/**
 * Only allow same-origin relative paths as post-login redirect targets.
 * Rejects absolute URLs and protocol-relative ("//host") values to prevent open redirects.
 */
export const sanitizeReferrer = (value: unknown, fallback = '/'): string => {
	const raw = Array.isArray(value) ? value[0] : value;
	if (typeof raw !== 'string') return fallback;
	const path = raw.trim();
	if (!path.startsWith('/') || path.startsWith('//') || path.startsWith('/\\')) return fallback;
	if (/^\/(login|register|account\/join)(\/|\?|$)/.test(path)) return fallback;
	return path;
};
