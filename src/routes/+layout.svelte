<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { mcps, categories, availableTags, loading, error } from '../lib/stores/mcpStore.js';
	import { fetchMCPs, fetchCategories, fetchTags } from '../lib/utils/api.js';
	import Header from '../lib/components/Header.svelte';
	import MCPModal from '../lib/components/MCPModal.svelte';
	
	onMount(async () => {
		loading.set(true);
		error.set(null);
		
		try {
			// Load initial data
			const [mcpsData, categoriesData, tagsData] = await Promise.all([
				fetchMCPs(),
				fetchCategories(),
				fetchTags()
			]);
			
			mcps.set(mcpsData.mcps || []);
			categories.set(categoriesData.categories || []);
			availableTags.set(tagsData.tags || []);
		} catch (err) {
			console.error('Failed to load initial data:', err);
			error.set(err.message || 'Failed to load data. Please refresh the page.');
		} finally {
			loading.set(false);
		}
	});
</script>

<svelte:head>
	<title>MCP Marketplace - Discover Model Context Protocol Servers</title>
	<meta name="description" content="Browse and discover Model Context Protocol servers and tools for AI applications" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<Header />
	<main>
		<slot />
	</main>
	<MCPModal />
</div>

{#if $error}
	<div class="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-md p-4 max-w-md z-40">
		<div class="flex">
			<div class="flex-shrink-0">
				<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
					<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
				</svg>
			</div>
			<div class="ml-3">
				<p class="text-sm text-red-800">{$error}</p>
			</div>
			<div class="ml-auto pl-3">
				<div class="-mx-1.5 -my-1.5">
					<button
						on:click={() => error.set(null)}
						class="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
					>
						<span class="sr-only">Dismiss</span>
						<svg class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
