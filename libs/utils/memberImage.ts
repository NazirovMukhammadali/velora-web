import { REACT_APP_API_URL } from '../config';

/** Resolve member avatar — supports uploads path, absolute URL, or site-relative path. */
export const resolveMemberImageUrl = (
	memberImage?: string | null,
	apiBase: string = REACT_APP_API_URL,
): string => {
	if (!memberImage?.trim()) return '/img/profile/defaultUser.svg';
	const src = memberImage.trim();
	if (src.startsWith('http://') || src.startsWith('https://')) return src;
	if (src.startsWith('/')) return src;
	return `${apiBase}/${src.replace(/^\//, '')}`;
};

/** Derive a short city label from seeded agent nicknames (e.g. velora_agent_seoul → Seoul). */
export const getAgentLocationLabel = (memberNick?: string, memberAddress?: string): string => {
	if (memberAddress?.trim()) return memberAddress.trim();
	const nick = memberNick ?? '';
	const match = nick.match(/velora_agent_(\w+)/i);
	if (match?.[1]) {
		const city = match[1];
		return city.charAt(0).toUpperCase() + city.slice(1);
	}
	return 'Travel expert';
};
