import { assistantErrorText, formatSourcePrice, parseAssistantText, toHistory } from '../libs/utils/assistant';
import type { AssistantMessage } from '../libs/types/assistant/assistant';

describe('assistant helpers', () => {
	it('builds API history from completed turns only (no errors, max 8, max 1000 chars)', () => {
		const messages: AssistantMessage[] = [
			...Array.from({ length: 10 }, (_, i) => ({ id: `u${i}`, role: 'user' as const, text: `q${i}` })),
			{ id: 'e', role: 'assistant', text: 'oops', error: true },
			{ id: 'l', role: 'user', text: 'x'.repeat(1500) },
		];
		const history = toHistory(messages);
		expect(history).toHaveLength(8);
		expect(history.some((turn) => turn.text === 'oops')).toBe(false);
		expect(history[history.length - 1].text).toHaveLength(1000);
	});

	it('formats prices with the unit of each listing type', () => {
		expect(formatSourcePrice({ type: 'hotel', priceUsd: 140 })).toBe('$140 / night');
		expect(formatSourcePrice({ type: 'flight', priceUsd: 1250.4 })).toBe('$1,250');
	});

	it('maps API errors to friendly copy', () => {
		expect(assistantErrorText({ graphQLErrors: [{ extensions: { code: 'TOO_MANY_REQUESTS' } }] })).toMatch(
			/wait a minute/,
		);
		expect(assistantErrorText({ networkError: new Error('x') })).toMatch(/can't reach/);
	});
});

describe('parseAssistantText', () => {
	it('turns **bold** into bold segments and list markers into bullets', () => {
		expect(parseAssistantText('1. **Seoul City Lights**\n   * **Price:** $420\n- Tip')).toEqual([
			{ text: '1. ', bold: false },
			{ text: 'Seoul City Lights', bold: true },
			{ text: '\n   • ', bold: false },
			{ text: 'Price:', bold: true },
			{ text: ' $420\n• Tip', bold: false },
		]);
	});

	it('strips headings, inline code and single-asterisk emphasis', () => {
		expect(parseAssistantText('## Hotels\nTry *Hanok* stay `now`')).toEqual([
			{ text: 'Hotels\nTry Hanok stay now', bold: false },
		]);
	});

	it('keeps HTML-looking text as plain text', () => {
		expect(parseAssistantText('<img src=x onerror=alert(1)>')).toEqual([
			{ text: '<img src=x onerror=alert(1)>', bold: false },
		]);
	});
});
