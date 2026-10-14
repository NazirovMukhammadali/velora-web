import { getJwtToken, setJwtToken, clearJwtToken, isJwtExpired } from '../libs/auth/token';

const makeJwt = (payload: object) => `header.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.sig`;

const memory = new Map<string, string>();

beforeAll(() => {
	Object.defineProperty(globalThis, 'localStorage', {
		value: {
			getItem: (k: string) => memory.get(k) ?? null,
			setItem: (k: string, v: string) => {
				memory.set(k, v);
			},
			removeItem: (k: string) => {
				memory.delete(k);
			},
			clear: () => memory.clear(),
		},
		configurable: true,
	});
	Object.defineProperty(globalThis, 'window', {
		value: { localStorage: globalThis.localStorage },
		configurable: true,
	});
});

describe('auth token helpers', () => {
	beforeEach(() => {
		memory.clear();
	});

	it('reads and writes access token', () => {
		expect(getJwtToken()).toBe('');
		setJwtToken('token-abc');
		expect(getJwtToken()).toBe('token-abc');
		clearJwtToken();
		expect(getJwtToken()).toBe('');
	});

	it('detects expired tokens and drops them from storage', () => {
		const nowSec = Math.floor(Date.now() / 1000);
		const expired = makeJwt({ _id: 'a', exp: nowSec - 60 });
		const valid = makeJwt({ _id: 'a', exp: nowSec + 3600 });

		expect(isJwtExpired(expired)).toBe(true);
		expect(isJwtExpired(valid)).toBe(false);
		expect(isJwtExpired('not-a-jwt')).toBe(false);

		setJwtToken(expired);
		expect(getJwtToken()).toBe('');
		expect(memory.has('accessToken')).toBe(false);

		setJwtToken(valid);
		expect(getJwtToken()).toBe(valid);
	});
});
