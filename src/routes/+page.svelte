<script>
	import { filteredMcps, loading } from '../lib/stores/mcpStore.js';
	import SearchBar from '../lib/components/SearchBar.svelte';
	import FilterSidebar from '../lib/components/FilterSidebar.svelte';
	import MCPCard from '../lib/components/MCPCard.svelte';
	import LoadingSpinner from '../lib/components/LoadingSpinner.svelte';
</script>

<svelte:head>
	<title>MCP Marketplace - Discover Model Context Protocol Servers</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Search Bar -->
	<SearchBar />
	
	<div class="flex flex-col lg:flex-row gap-8">
		<!-- Sidebar -->
		<aside class="lg:w-64 flex-shrink-0">
			<FilterSidebar />
		</aside>
		
		<!-- Main Content -->
		<main class="flex-1 min-w-0">
			{#if $loading}
				<LoadingSpinner />
			{:else if $filteredMcps.length === 0}
				<div class="text-center py-12">
					<svg class="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
					</svg>
					<h3 class="text-lg font-medium text-gray-900 mb-2">No MCPs found</h3>
					<p class="text-gray-600 mb-4">Try adjusting your search terms or filters to find what you're looking for.</p>
					<button class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
						<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
						</svg>
						Submit New MCP
					</button>
				</div>
			{:else}
				<!-- Results Header -->
				<div class="flex items-center justify-between mb-6">
					<h2 class="text-xl font-semibold text-gray-900">
						{$filteredMcps.length} {$filteredMcps.length === 1 ? 'MCP' : 'MCPs'} found
					</h2>
					<div class="hidden sm:block text-sm text-gray-600">
						Showing results for Model Context Protocol servers and tools
					</div>
				</div>
				
				<!-- MCP Grid -->
				<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
					{#each $filteredMcps as mcp (mcp.id)}
						<MCPCard {mcp} />
					{/each}
				</div>
			{/if}
		</main>
	</div>
</div>
