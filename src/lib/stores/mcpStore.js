import { writable, derived } from 'svelte/store';

// MCP data store
export const mcps = writable([]);
export const loading = writable(false);
export const error = writable(null);

// Filter stores
export const searchQuery = writable('');
export const selectedCategory = writable('all');
export const selectedTags = writable([]);
export const sortBy = writable('popularity');

// Categories and tags
export const categories = writable([]);
export const availableTags = writable([]);

// Selected MCP for modal
export const selectedMcp = writable(null);

// Filtered MCPs based on search and filters
export const filteredMcps = derived(
	[mcps, searchQuery, selectedCategory, selectedTags, sortBy],
	([$mcps, $searchQuery, $selectedCategory, $selectedTags, $sortBy]) => {
		let filtered = [...$mcps];

		// Search filter
		if ($searchQuery.trim()) {
			const query = $searchQuery.toLowerCase();
			filtered = filtered.filter(mcp => 
				mcp.name.toLowerCase().includes(query) ||
				mcp.description.toLowerCase().includes(query) ||
				mcp.tags.some(tag => tag.toLowerCase().includes(query))
			);
		}

		// Category filter
		if ($selectedCategory !== 'all') {
			filtered = filtered.filter(mcp => mcp.category === $selectedCategory);
		}

		// Tags filter
		if ($selectedTags.length > 0) {
			filtered = filtered.filter(mcp => 
				$selectedTags.some(tag => mcp.tags.includes(tag))
			);
		}

		// Sort
		switch ($sortBy) {
			case 'popularity':
				filtered.sort((a, b) => b.downloads - a.downloads);
				break;
			case 'rating':
				filtered.sort((a, b) => b.rating - a.rating);
				break;
			case 'newest':
				filtered.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
				break;
			case 'name':
				filtered.sort((a, b) => a.name.localeCompare(b.name));
				break;
		}

		return filtered;
	}
);

// Stats
export const stats = derived(mcps, ($mcps) => ({
	total: $mcps.length,
	categories: [...new Set($mcps.map(mcp => mcp.category))].length,
	totalDownloads: $mcps.reduce((sum, mcp) => sum + mcp.downloads, 0)
}));
