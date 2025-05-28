<script>
	import { searchQuery, sortBy } from '../stores/mcpStore.js';
	
	let searchInput = '';
	let sortInput = 'popularity';
	
	// Update stores when inputs change
	$: searchQuery.set(searchInput);
	$: sortBy.set(sortInput);
	
	// Initialize from store values
	$: searchInput = $searchQuery;
	$: sortInput = $sortBy;
</script>

<div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
	<div class="flex flex-col sm:flex-row gap-4">
		<!-- Search Input -->
		<div class="flex-1 relative">
			<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
				<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
				</svg>
			</div>
			<input
				type="text"
				bind:value={searchInput}
				placeholder="Search MCPs, tools, or categories..."
				class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
			/>
		</div>
		
		<!-- Sort Dropdown -->
		<div class="sm:w-48">
			<select
				bind:value={sortInput}
				class="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
			>
				<option value="popularity">Most Popular</option>
				<option value="rating">Highest Rated</option>
				<option value="newest">Recently Updated</option>
				<option value="name">Alphabetical</option>
			</select>
		</div>
	</div>
	
	<!-- Search Stats -->
	{#if searchInput.trim()}
		<div class="mt-3 text-sm text-gray-600">
			Searching for: <span class="font-medium text-gray-900">"{searchInput}"</span>
		</div>
	{/if}
</div>
