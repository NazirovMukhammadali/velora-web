/** Ranking for search-box suggestions (kept React-free for unit tests). */

export type Suggestion = {
	/** Text put into the input when picked. */
	value: string;
	/** Secondary text (airport code, "3 hotels", …). */
	hint?: string;
	/** Extra words that should also match (e.g. IATA code). */
	keywords?: string[];
};

/**
 * Prefix matches first (on the value or any keyword), then "contains" matches; alphabetical within each group.
 * An empty query lists everything so the dropdown can act as a browseable menu on focus.
 */
export const rankSuggestions = (options: Suggestion[], query: string, limit = 8): Suggestion[] => {
	const q = query.trim().toLowerCase();
	const scored = options
		.map((option) => {
			if (!q) return { option, score: 1 };
			const words = [option.value, ...(option.keywords ?? [])].map((word) => word.toLowerCase());
			if (words.some((word) => word.startsWith(q) || word.split(/\s+/).some((part) => part.startsWith(q)))) {
				return { option, score: 2 };
			}
			if (words.some((word) => word.includes(q))) return { option, score: 1 };
			return { option, score: 0 };
		})
		.filter((entry) => entry.score > 0)
		// An exact pick is already in the box — no need to suggest it again.
		.filter((entry) => entry.option.value.toLowerCase() !== q);

	scored.sort((a, b) => b.score - a.score || a.option.value.localeCompare(b.option.value));
	return scored.slice(0, limit).map((entry) => entry.option);
};

/** Distinct, counted city suggestions from a list of location strings ("Dubai" ×3 → hint "3 hotels"). */
export const citySuggestions = (locations: (string | null | undefined)[], noun: [string, string]): Suggestion[] => {
	const counts = new Map<string, number>();
	for (const raw of locations) {
		const city = raw?.trim();
		if (city) counts.set(city, (counts.get(city) ?? 0) + 1);
	}
	return Array.from(counts, ([value, count]) => ({ value, hint: `${count} ${count === 1 ? noun[0] : noun[1]}` }));
};
