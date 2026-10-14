/** Plain-text helpers for community articles (content may be editor HTML). */

export const stripHtml = (html?: string | null): string =>
	(html ?? '')
		.replace(/<[^>]*>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/\s+/g, ' ')
		.trim();

/** Minutes to read at ~200 words per minute (never less than 1). */
export const readingMinutes = (html?: string | null): number => {
	const words = stripHtml(html).split(' ').filter(Boolean).length;
	return Math.max(1, Math.round(words / 200));
};

/** First `max` characters of the plain text, cut on a word boundary. */
export const excerpt = (html?: string | null, max = 140): string => {
	const text = stripHtml(html);
	if (text.length <= max) return text;
	const cut = text.slice(0, max);
	return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), max - 20)).trimEnd()}…`;
};

/** Article cover URL: uploads are API-relative, seeded images are absolute; empty → bundled placeholder. */
export const resolveArticleImage = (path: string | null | undefined, apiBase: string): string => {
	const src = path?.trim();
	if (!src) return '/img/community/communityImg.png';
	if (/^https?:\/\//.test(src) || src.startsWith('/')) return src;
	return `${apiBase}/${src.replace(/^\/+/, '')}`;
};
