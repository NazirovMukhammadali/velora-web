import { getJwtToken, setJwtToken, clearJwtToken } from '../libs/auth/token';

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
});
