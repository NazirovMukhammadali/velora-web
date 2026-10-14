import { citySuggestions, rankSuggestions } from '../libs/utils/suggestions';

const airports = [
	{ value: 'Tashkent', hint: 'TAS', keywords: ['TAS'] },
	{ value: 'Tokyo', hint: 'NRT', keywords: ['NRT'] },
	{ value: 'Istanbul', hint: 'IST', keywords: ['IST'] },
	{ value: 'New York', hint: 'JFK', keywords: ['JFK'] },
	{ value: 'Seoul', hint: 'ICN', keywords: ['ICN'] },
];

describe('rankSuggestions', () => {
	it('puts prefix matches before contains matches', () => {
		expect(rankSuggestions(airports, 't').map((s) => s.value)).toEqual(['Tashkent', 'Tokyo', 'Istanbul']);
	});

	it('matches IATA codes and later words of a city', () => {
		expect(rankSuggestions(airports, 'icn').map((s) => s.value)).toEqual(['Seoul']);
		expect(rankSuggestions(airports, 'york').map((s) => s.value)).toEqual(['New York']);
	});

	it('lists everything for an empty query and hides an exact pick', () => {
		expect(rankSuggestions(airports, '')).toHaveLength(5);
		expect(rankSuggestions(airports, 'Tokyo')).toEqual([]);
	});
});

describe('citySuggestions', () => {
	it('dedupes and counts cities', () => {
		expect(citySuggestions(['Dubai', ' Dubai ', 'Rome', null, ''], ['hotel', 'hotels'])).toEqual([
			{ value: 'Dubai', hint: '2 hotels' },
			{ value: 'Rome', hint: '1 hotel' },
		]);
	});
});
