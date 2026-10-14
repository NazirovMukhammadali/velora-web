import type { AssistantMessage, AssistantSource } from '../types/assistant/assistant';

/** Mirrors the API limits (ChatbotPromptInput). */
export const ASSISTANT_PROMPT_MAX = 1000;
export const ASSISTANT_HISTORY_MAX = 8;

/** Previous completed turns in the shape the API expects (errors and the pending turn excluded). */
export const toHistory = (messages: AssistantMessage[]): { role: 'user' | 'assistant'; text: string }[] =>
	messages
		.filter((message) => !(message.role === 'assistant' && message.error) && message.text.trim())
		.slice(-ASSISTANT_HISTORY_MAX)
		.map((message) => ({ role: message.role, text: message.text.slice(0, ASSISTANT_PROMPT_MAX) }));

const PRICE_UNITS: Record<string, string> = { hotel: '/ night', tour: '/ person', rentcar: '/ day', flight: '' };
const TYPE_LABELS: Record<string, string> = { hotel: 'Hotel', tour: 'Tour', rentcar: 'Car', flight: 'Flight' };

export const sourceTypeLabel = (type: string): string => TYPE_LABELS[type] ?? 'Listing';

export const formatSourcePrice = (source: Pick<AssistantSource, 'type' | 'priceUsd'>): string => {
	const amount = `$${Math.round(source.priceUsd).toLocaleString('en-US')}`;
	const unit = PRICE_UNITS[source.type] ?? '';
	return unit ? `${amount} ${unit}` : amount;
};

/** Friendly copy for API failures (rate limit, validation, network). */
export const assistantErrorText = (err: unknown): string => {
	const anyErr = err as { graphQLErrors?: { extensions?: { code?: string } }[]; networkError?: unknown };
	const code = anyErr?.graphQLErrors?.[0]?.extensions?.code;
	if (code === 'TOO_MANY_REQUESTS') return "You're sending messages a bit fast — please wait a minute and try again.";
	if (code === 'BAD_REQUEST' || code === 'BAD_USER_INPUT')
		return 'That message could not be sent. Please keep it under 1000 characters.';
	if (anyErr?.networkError) return "I can't reach the Velora server right now. Check your connection and try again.";
	return 'Something went wrong on my side. Please try again.';
};

export type InlineSegment = { text: string; bold: boolean };

/**
 * Models answer in light Markdown. Render it as plain React text (never HTML):
 * list markers become bullets, headings/italics lose their markers, **bold** becomes a bold segment.
 */
export const parseAssistantText = (raw: string): InlineSegment[] => {
	const text = raw
		.replace(/\r\n/g, '\n')
		.replace(/^[ \t]*#{1,6}[ \t]+/gm, '')
		.replace(/^([ \t]*)[*-][ \t]+/gm, '$1• ')
		.replace(/`([^`\n]+)`/g, '$1');
	const segments: InlineSegment[] = [];
	const pattern = /\*\*([^*\n]+?)\*\*|__([^_\n]+?)__/g;
	let last = 0;
	for (let match = pattern.exec(text); match; match = pattern.exec(text)) {
		if (match.index > last) segments.push({ text: text.slice(last, match.index), bold: false });
		segments.push({ text: match[1] ?? match[2], bold: true });
		last = match.index + match[0].length;
	}
	if (last < text.length) segments.push({ text: text.slice(last), bold: false });
	// Leftover single-asterisk emphasis: drop the markers, keep the words.
	return segments.map((segment) =>
		segment.bold ? segment : { ...segment, text: segment.text.replace(/\*([^*\n]+)\*/g, '$1') },
	);
};
