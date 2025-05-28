<script>
	import { selectedCategory, selectedTags, categories, availableTags } from '../stores/mcpStore.js';
	
	function toggleTag(tag) {
		selectedTags.update(tags => {
			if (tags.includes(tag)) {
				return tags.filter(t => t !== tag);
			} else {
				return [...tags, tag];
			}
		});
	}
	
	function clearAllFilters() {
		selectedCategory.set('all');
		selectedTags.set([]);
	}
</script>

<div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
	<div class="flex items-center justify-between mb-4">
		<h3 class="text-lg font-medium text-gray-900">Filters</h3>
		{#if $selectedCategory !== 'all' || $selectedTags.length > 0}
			<button
				on:click={clearAllFilters}
				class="text-sm text-primary-600 hover:text-primary-500 font-medium"
			>
				Clear all
			</button>
		{/if}
	</div>
	
	<!-- Categories -->
	<div class="mb-6">
		<h4 class="text-sm font-medium text-gray-900 mb-3">Categories</h4>
		<div class="space-y-2">
			<label class="flex items-center">
				<input
					type="radio"
					bind:group={$selectedCategory}
					value="all"
					class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
				/>
				<span class="ml-2 text-sm text-gray-700">All Categories</span>
			</label>
			{#each $categories as category}
				<label class="flex items-center">
					<input
						type="radio"
						bind:group={$selectedCategory}
						value={category}
						class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
					/>
					<span class="ml-2 text-sm text-gray-700 capitalize">{category}</span>
				</label>
			{/each}
		</div>
	</div>
	
	<!-- Tags -->
	<div>
		<h4 class="text-sm font-medium text-gray-900 mb-3">Tags</h4>
		<div class="space-y-2 max-h-64 overflow-y-auto">
			{#each $availableTags as tag}
				<label class="flex items-center">
					<input
						type="checkbox"
						checked={$selectedTags.includes(tag)}
						on:change={() => toggleTag(tag)}
						class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
					/>
					<span class="ml-2 text-sm text-gray-700">{tag}</span>
				</label>
			{/each}
		</div>
	</div>
	
	<!-- Selected Tags Display -->
	{#if $selectedTags.length > 0}
		<div class="mt-4 pt-4 border-t border-gray-200">
			<h5 class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Selected Tags</h5>
			<div class="flex flex-wrap gap-1">
				{#each $selectedTags as tag}
					<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-100 text-primary-800">
						{tag}
						<button
							on:click={() => toggleTag(tag)}
							class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-primary-600 hover:text-primary-500 hover:bg-primary-200"
						>
							<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
							</svg>
						</button>
					</span>
				{/each}
			</div>
		</div>
	{/if}
</div>
