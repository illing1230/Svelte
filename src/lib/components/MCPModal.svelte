<script>
	import { selectedMcp } from '../stores/mcpStore.js';
	import { onMount } from 'svelte';
	
	let modal;
	
	function closeModal() {
		selectedMcp.set(null);
	}
	
	function handleKeydown(event) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}
	
	function handleBackdropClick(event) {
		if (event.target === event.currentTarget) {
			closeModal();
		}
	}
	
	onMount(() => {
		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});
	
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
	
	function copyToClipboard(text) {
		navigator.clipboard.writeText(text).then(() => {
			// Could add a toast notification here
		});
	}
</script>

{#if $selectedMcp}
	<div 
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in"
		on:click={handleBackdropClick}
		bind:this={modal}
	>
		<div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
			<!-- Header -->
			<div class="flex items-start justify-between p-6 border-b border-gray-200">
				<div class="flex-1 min-w-0">
					<h2 class="text-2xl font-bold text-gray-900 mb-2">{$selectedMcp.name}</h2>
					<div class="flex items-center space-x-4 text-sm text-gray-600">
						<span>by <span class="font-medium">{$selectedMcp.author}</span></span>
						<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 capitalize">
							{$selectedMcp.category}
						</span>
						<div class="flex items-center space-x-1">
							<div class="flex items-center">
								{#each getRatingStars($selectedMcp.rating) as star}
									{#if star === 'full'}
										<svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
										</svg>
									{:else if star === 'half'}
										<svg class="w-4 h-4 text-yellow-400" viewBox="0 0 20 20">
											<defs>
												<linearGradient id="half-modal-{$selectedMcp.id}">
													<stop offset="50%" stop-color="currentColor"/>
													<stop offset="50%" stop-color="transparent"/>
												</linearGradient>
											</defs>
											<path fill="url(#half-modal-{$selectedMcp.id})" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
										</svg>
									{:else}
										<svg class="w-4 h-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
										</svg>
									{/if}
								{/each}
							</div>
							<span class="font-medium">{$selectedMcp.rating}</span>
						</div>
					</div>
				</div>
				<button
					on:click={closeModal}
					class="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
			</div>
			
			<!-- Content -->
			<div class="p-6">
				<!-- Description -->
				<div class="mb-6">
					<h3 class="text-lg font-semibold text-gray-900 mb-3">Description</h3>
					<p class="text-gray-700 leading-relaxed">{$selectedMcp.description}</p>
				</div>
				
				<!-- Details -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
					<div>
						<h4 class="text-md font-semibold text-gray-900 mb-3">Details</h4>
						<dl class="space-y-2">
							<div class="flex justify-between">
								<dt class="text-sm text-gray-600">Version:</dt>
								<dd class="text-sm font-medium text-gray-900">{$selectedMcp.version}</dd>
							</div>
							<div class="flex justify-between">
								<dt class="text-sm text-gray-600">Downloads:</dt>
								<dd class="text-sm font-medium text-gray-900">{$selectedMcp.downloads.toLocaleString()}</dd>
							</div>
							<div class="flex justify-between">
								<dt class="text-sm text-gray-600">License:</dt>
								<dd class="text-sm font-medium text-gray-900">{$selectedMcp.license}</dd>
							</div>
							<div class="flex justify-between">
								<dt class="text-sm text-gray-600">Last Updated:</dt>
								<dd class="text-sm font-medium text-gray-900">{new Date($selectedMcp.lastUpdated).toLocaleDateString()}</dd>
							</div>
						</dl>
					</div>
					
					<div>
						<h4 class="text-md font-semibold text-gray-900 mb-3">Repository</h4>
						<a 
							href={$selectedMcp.repository} 
							target="_blank" 
							rel="noopener noreferrer"
							class="inline-flex items-center text-primary-600 hover:text-primary-500 text-sm"
						>
							<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"></path>
							</svg>
							View on GitHub
						</a>
					</div>
				</div>
				
				<!-- Tags -->
				<div class="mb-6">
					<h4 class="text-md font-semibold text-gray-900 mb-3">Tags</h4>
					<div class="flex flex-wrap gap-2">
						{#each $selectedMcp.tags as tag}
							<span class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-primary-50 text-primary-700">
								{tag}
							</span>
						{/each}
					</div>
				</div>
				
				<!-- Installation -->
				<div class="mb-6">
					<h4 class="text-md font-semibold text-gray-900 mb-3">Installation</h4>
					<div class="bg-gray-50 rounded-md p-4">
						<div class="flex items-center justify-between mb-2">
							<span class="text-sm font-medium text-gray-700">npm</span>
							<button
								on:click={() => copyToClipboard(`npm install ${$selectedMcp.packageName}`)}
								class="text-sm text-primary-600 hover:text-primary-500"
							>
								Copy
							</button>
						</div>
						<code class="text-sm text-gray-900 bg-white px-3 py-2 rounded border block">
							npm install {$selectedMcp.packageName}
						</code>
					</div>
				</div>
				
				<!-- Features -->
				{#if $selectedMcp.features && $selectedMcp.features.length > 0}
					<div class="mb-6">
						<h4 class="text-md font-semibold text-gray-900 mb-3">Features</h4>
						<ul class="space-y-2">
							{#each $selectedMcp.features as feature}
								<li class="flex items-start">
									<svg class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
									</svg>
									<span class="text-sm text-gray-700">{feature}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
			
			<!-- Footer -->
			<div class="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
				<button
					on:click={closeModal}
					class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
				>
					Close
				</button>
				<a
					href={$selectedMcp.repository}
					target="_blank"
					rel="noopener noreferrer"
					class="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
				>
					View Repository
				</a>
			</div>
		</div>
	</div>
{/if}
