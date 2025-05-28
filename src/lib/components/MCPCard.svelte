<script>
	import { selectedMcp } from '../stores/mcpStore.js';
	
	export let mcp;
	
	function openModal() {
		selectedMcp.set(mcp);
	}
	
	function getRatingStars(rating) {
		const stars = [];
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 >= 0.5;
		
		for (let i = 0; i < fullStars; i++) {
			stars.push('full');
		}
		
		if (hasHalfStar) {
			stars.push('half');
		}
		
		while (stars.length < 5) {
			stars.push('empty');
		}
		
		return stars;
	}
	
	function formatDownloads(downloads) {
		if (downloads >= 1000000) {
			return (downloads / 1000000).toFixed(1) + 'M';
		} else if (downloads >= 1000) {
			return (downloads / 1000).toFixed(1) + 'K';
		}
		return downloads.toString();
	}
	
	function getTimeAgo(dateString) {
		const date = new Date(dateString);
		const now = new Date();
		const diffInMs = now - date;
		const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
		
		if (diffInDays < 1) return 'Today';
		if (diffInDays < 7) return `${diffInDays}d ago`;
		if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
		if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}mo ago`;
		return `${Math.floor(diffInDays / 365)}y ago`;
	}
</script>

<div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer group">
	<button on:click={openModal} class="w-full text-left p-6">
		<!-- Header -->
		<div class="flex items-start justify-between mb-3">
			<div class="flex-1 min-w-0">
				<h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
					{mcp.name}
				</h3>
				<p class="text-sm text-gray-600 mt-1">by {mcp.author}</p>
			</div>
			<div class="flex items-center space-x-2 ml-4">
				<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 capitalize">
					{mcp.category}
				</span>
			</div>
		</div>
		
		<!-- Description -->
		<p class="text-gray-700 text-sm mb-4 line-clamp-2">
			{mcp.description}
		</p>
		
		<!-- Tags -->
		<div class="flex flex-wrap gap-1 mb-4">
			{#each mcp.tags.slice(0, 3) as tag}
				<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary-50 text-primary-700">
					{tag}
				</span>
			{/each}
			{#if mcp.tags.length > 3}
				<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-500">
					+{mcp.tags.length - 3} more
				</span>
			{/if}
		</div>
		
		<!-- Stats -->
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-4 text-sm text-gray-600">
				<!-- Rating -->
				<div class="flex items-center space-x-1">
					<div class="flex items-center">
						{#each getRatingStars(mcp.rating) as star}
							{#if star === 'full'}
								<svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
								</svg>
							{:else if star === 'half'}
								<svg class="w-4 h-4 text-yellow-400" viewBox="0 0 20 20">
									<defs>
										<linearGradient id="half-{mcp.id}">
											<stop offset="50%" stop-color="currentColor"/>
											<stop offset="50%" stop-color="transparent"/>
										</linearGradient>
									</defs>
									<path fill="url(#half-{mcp.id})" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
								</svg>
							{:else}
								<svg class="w-4 h-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
								</svg>
							{/if}
						{/each}
					</div>
					<span class="font-medium">{mcp.rating}</span>
				</div>
				
				<!-- Downloads -->
				<div class="flex items-center space-x-1">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
					</svg>
					<span>{formatDownloads(mcp.downloads)}</span>
				</div>
			</div>
			
			<!-- Last Updated -->
			<div class="text-xs text-gray-500">
				Updated {getTimeAgo(mcp.lastUpdated)}
			</div>
		</div>
	</button>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
