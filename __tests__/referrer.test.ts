import { sanitizeReferrer } from '../libs/utils/referrer';

describe('sanitizeReferrer', () => {
	it('keeps same-origin relative paths', () => {
		expect(sanitizeReferrer('/mypage')).toBe('/mypage');
		expect(sanitizeReferrer('/package/detail?type=tours&id=1')).toBe('/package/detail?type=tours&id=1');
		expect(sanitizeReferrer(['/bookings', '/x'])).toBe('/bookings');
	});

	it('rejects absolute, protocol-relative and auth-page targets', () => {
		expect(sanitizeReferrer('https://evil.com')).toBe('/');
		expect(sanitizeReferrer('//evil.com')).toBe('/');
		expect(sanitizeReferrer('/\\evil.com')).toBe('/');
		expect(sanitizeReferrer('javascript:alert(1)')).toBe('/');
		expect(sanitizeReferrer('/login?referrer=/x')).toBe('/');
		expect(sanitizeReferrer(undefined)).toBe('/');
	});
});
