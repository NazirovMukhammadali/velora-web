import { excerpt, readingMinutes, stripHtml } from '../libs/utils/article';

describe('article text helpers', () => {
	it('strips editor HTML and entities', () => {
		expect(stripHtml('<p>Hello&nbsp;<b>world</b> &amp; more</p>')).toBe('Hello world & more');
	});

	it('estimates reading time at ~200 wpm with a 1 minute floor', () => {
		expect(readingMinutes('short')).toBe(1);
		expect(readingMinutes(Array(1000).fill('word').join(' '))).toBe(5);
	});

	it('cuts excerpts on a word boundary', () => {
		const text = 'Seoul palaces offer free entry when wearing hanbok during the autumn season';
		const out = excerpt(text, 30);
		expect(out.endsWith('…')).toBe(true);
		expect(out.length).toBeLessThanOrEqual(31);
		expect(text.startsWith(out.slice(0, -1))).toBe(true);
	});
});
