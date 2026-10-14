const TOKEN_KEY = 'accessToken';

/** Decode the JWT payload without verifying it (verification is the backend's job). */
const decodePayload = (token: string): { exp?: number } | null => {
	try {
		const part = token.split('.')[1];
		if (!part) return null;
		const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
		const json =
			typeof atob === 'function'
				? decodeURIComponent(
						atob(base64)
							.split('')
							.map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
							.join(''),
				  )
				: Buffer.from(base64, 'base64').toString('utf8');
		return JSON.parse(json);
	} catch {
		return null;
	}
};

/** True when the token carries an `exp` claim that is already in the past. */
export function isJwtExpired(token: string, nowMs: number = Date.now()): boolean {
	const payload = decodePayload(token);
	if (!payload || typeof payload.exp !== 'number') return false;
	return payload.exp * 1000 <= nowMs;
}

export function getJwtToken(): string {
	if (typeof window === 'undefined') return '';
	const token = localStorage.getItem(TOKEN_KEY) ?? '';
	if (token && isJwtExpired(token)) {
		localStorage.removeItem(TOKEN_KEY);
		return '';
	}
	return token;
}

export function setJwtToken(token: string): void {
	localStorage.setItem(TOKEN_KEY, token);
}

export function clearJwtToken(): void {
	localStorage.removeItem(TOKEN_KEY);
}
