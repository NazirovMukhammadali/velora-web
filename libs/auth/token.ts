export function getJwtToken(): string {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('accessToken') ?? '';
	}
	return '';
}

export function setJwtToken(token: string): void {
	localStorage.setItem('accessToken', token);
}

export function clearJwtToken(): void {
	localStorage.removeItem('accessToken');
}
