/**
 * Pure catalog-query helpers covered via heroSearch mapping used by useCatalogQuery.
 * Full hook render tests need a Next router mock; mapping/sync rules are the critical path.
 */
import { mapHeroQueryToFilters, stripKeysForCatalog } from '../libs/utils/heroSearch';

describe('useCatalogQuery mapping (via heroSearch)', () => {
	it('drops invalid endDate when before startDate', () => {
		const patch = mapHeroQueryToFilters(
			{ startDate: '2026-08-10', endDate: '2026-08-01' },
			{ startDate: '', endDate: '', location: '' },
		);
		expect(patch.startDate).toBe('2026-08-10');
		expect(patch.endDate).toBeUndefined();
	});

	it('drops invalid party values', () => {
		const patch = mapHeroQueryToFilters({ party: 'abc' }, { party: '', location: '' });
		expect(patch.party).toBeUndefined();
	});

	it('provides strip keys that catalogs sync after hydrate', () => {
		expect(stripKeysForCatalog('/rentcar')).toEqual(expect.arrayContaining(['from', 'to', 'guests']));
		expect(stripKeysForCatalog('/tours')).toEqual(
			expect.arrayContaining(['from', 'to', 'guests', 'price']),
		);
	});
});
