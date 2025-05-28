<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	
	export let data;
	
	$: mcp = data.mcp;
	
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

<svelte:head>
	<title>{mcp.name} - MCP Marketplace</title>
	<meta name="description" content={mcp.description} />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Back Button -->
	<button
		on:click={() => goto('/')}
		class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
	>
		<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
		</svg>
		Back to marketplace
	</button>
	
	<!-- Header -->
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
		<div class="flex items-start justify-between mb-6">
			<div class="flex-1 min-w-0">
				<h1 class="text-3xl font-bold text-gray-900 mb-3">{mcp.name}</h1>
				<div class="flex items-center space-x-4 text-sm text-gray-600 mb-4">
					<span>by <span class="font-medium">{mcp.author}</span></span>
					<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 capitalize">
						{mcp.category}
					</span>
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
											<linearGradient id="half-page-{mcp.id}">
												<stop offset="50%" stop-color="currentColor"/>
												<stop offset="50%" stop-color="transparent"/>
											</linearGradient>
										</defs>
										<path fill="url(#half-page-{mcp.id})" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
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
				</div>
				<p class="text-gray-700 text-lg leading-relaxed">{mcp.description}</p>
			</div>
		</div>
		
		<!-- Quick Actions -->
		<div class="flex flex-wrap gap-3">
			<a
				href={mcp.repository}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
			>
				<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"></path>
				</svg>
				View Repository
			</a>
			<button
				on:click={() => copyToClipboard(`npm install ${mcp.packageName}`)}
				class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
			>
				<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
				</svg>
				Copy Install Command
			</button>
		</div>
	</div>
	
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
		<!-- Main Content -->
		<div class="lg:col-span-2 space-y-8">
			<!-- Installation -->
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 class="text-xl font-semibold text-gray-900 mb-4">Installation</h2>
				<div class="bg-gray-50 rounded-md p-4">
					<div class="flex items-center justify-between mb-2">
						<span class="text-sm font-medium text-gray-700">npm</span>
						<button
							on:click={() => copyToClipboard(`npm install ${mcp.packageName}`)}
							class="text-sm text-primary-600 hover:text-primary-500"
						>
							Copy
						</button>
					</div>
					<code class="text-sm text-gray-900 bg-white px-3 py-2 rounded border block">
						npm install {mcp.packageName}
					</code>
				</div>
			</div>
			
			<!-- Features -->
			{#if mcp.features && mcp.features.length > 0}
				<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<h2 class="text-xl font-semibold text-gray-900 mb-4">Features</h2>
					<ul class="space-y-3">
						{#each mcp.features as feature}
							<li class="flex items-start">
								<svg class="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
								<span class="text-gray-700">{feature}</span>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
		
		<!-- Sidebar -->
		<div class="space-y-6">
			<!-- Details -->
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">Details</h3>
				<dl class="space-y-3">
					<div>
						<dt class="text-sm text-gray-600">Version</dt>
						<dd class="text-sm font-medium text-gray-900 mt-1">{mcp.version}</dd>
					</div>
					<div>
						<dt class="text-sm text-gray-600">Downloads</dt>
						<dd class="text-sm font-medium text-gray-900 mt-1">{mcp.downloads.toLocaleString()}</dd>
					</div>
					<div>
						<dt class="text-sm text-gray-600">License</dt>
						<dd class="text-sm font-medium text-gray-900 mt-1">{mcp.license}</dd>
					</div>
					<div>
						<dt class="text-sm text-gray-600">Last Updated</dt>
						<dd class="text-sm font-medium text-gray-900 mt-1">{new Date(mcp.lastUpdated).toLocaleDateString()}</dd>
					</div>
				</dl>
			</div>
			
			<!-- Tags -->
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h3 class="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
				<div class="flex flex-wrap gap-2">
					{#each mcp.tags as tag}
						<span class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-primary-50 text-primary-700">
							{tag}
						</span>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
