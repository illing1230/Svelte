class MCPMarketplace {
    constructor() {
        this.mcps = [];
        this.filteredMcps = [];
        this.categories = [];
        this.tags = [];
        this.selectedCategory = 'all';
        this.selectedTags = [];
        this.searchQuery = '';
        this.sortBy = 'popularity';
        
        this.init();
    }
    
    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.renderCategories();
        this.renderTags();
        this.filterAndRender();
        
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('content').classList.remove('hidden');
    }
    
    async loadData() {
        try {
            const [mcpsResponse, categoriesResponse, tagsResponse] = await Promise.all([
                fetch('/api/mcps'),
                fetch('/api/categories'),
                fetch('/api/tags')
            ]);
            
            const mcpsData = await mcpsResponse.json();
            const categoriesData = await categoriesResponse.json();
            const tagsData = await tagsResponse.json();
            
            this.mcps = mcpsData.mcps || [];
            this.categories = categoriesData.categories || [];
            this.tags = tagsData.tags || [];
            
        } catch (error) {
            console.error('데이터 로딩 실패:', error);
        }
    }
    
    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.filterAndRender();
        });
        
        // Sort select
        const sortSelect = document.getElementById('sort-select');
        sortSelect.addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.filterAndRender();
        });
        
        // Clear filters
        const clearFilters = document.getElementById('clear-filters');
        clearFilters.addEventListener('click', () => {
            this.clearAllFilters();
        });
        
        // Modal close
        const modal = document.getElementById('modal');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
        
        // Escape key for modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }
    
    renderCategories() {
        const container = document.getElementById('categories-list');
        
        const allOption = this.createRadioOption('all', 'category', '모든 카테고리', this.selectedCategory === 'all');
        container.appendChild(allOption);
        
        this.categories.forEach(category => {
            const option = this.createRadioOption(category, 'category', this.formatCategoryName(category), this.selectedCategory === category);
            container.appendChild(option);
        });
    }
    
    renderTags() {
        const container = document.getElementById('tags-list');
        
        this.tags.forEach(tag => {
            const option = this.createCheckboxOption(tag, 'tag', tag, this.selectedTags.includes(tag));
            container.appendChild(option);
        });
    }
    
    createRadioOption(value, name, label, checked) {
        const wrapper = document.createElement('label');
        wrapper.className = 'flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors';
        
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = name;
        input.value = value;
        input.checked = checked;
        input.className = 'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300';
        
        input.addEventListener('change', () => {
            this.selectedCategory = value;
            this.filterAndRender();
            this.updateClearButton();
        });
        
        const span = document.createElement('span');
        span.className = 'ml-2 text-sm text-gray-700 capitalize';
        span.textContent = label;
        
        wrapper.appendChild(input);
        wrapper.appendChild(span);
        
        return wrapper;
    }
    
    createCheckboxOption(value, name, label, checked) {
        const wrapper = document.createElement('label');
        wrapper.className = 'flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors';
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = name;
        input.value = value;
        input.checked = checked;
        input.className = 'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded';
        
        input.addEventListener('change', () => {
            if (input.checked) {
                this.selectedTags.push(value);
            } else {
                this.selectedTags = this.selectedTags.filter(tag => tag !== value);
            }
            this.filterAndRender();
            this.updateClearButton();
        });
        
        const span = document.createElement('span');
        span.className = 'ml-2 text-sm text-gray-700';
        span.textContent = label;
        
        wrapper.appendChild(input);
        wrapper.appendChild(span);
        
        return wrapper;
    }
    
    formatCategoryName(category) {
        const categoryNames = {
            'file-system': '파일 시스템',
            'database': '데이터베이스',
            'web-scraping': '웹 스크래핑',
            'api-integration': 'API 통합',
            'communication': '커뮤니케이션',
            'productivity': '생산성',
            'ai-vision': 'AI 비전',
            'document-processing': '문서 처리',
            'cryptocurrency': '암호화폐',
            'social-media': '소셜 미디어',
            'cloud-storage': '클라우드 스토리지',
            'automation': '자동화'
        };
        return categoryNames[category] || category;
    }
    
    filterAndRender() {
        let filtered = [...this.mcps];
        
        // Search filter
        if (this.searchQuery.trim()) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(mcp => 
                mcp.name.toLowerCase().includes(query) ||
                mcp.description.toLowerCase().includes(query) ||
                mcp.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }
        
        // Category filter
        if (this.selectedCategory !== 'all') {
            filtered = filtered.filter(mcp => mcp.category === this.selectedCategory);
        }
        
        // Tags filter
        if (this.selectedTags.length > 0) {
            filtered = filtered.filter(mcp => 
                this.selectedTags.some(tag => mcp.tags.includes(tag))
            );
        }
        
        // Sort
        switch (this.sortBy) {
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
        
        this.filteredMcps = filtered;
        this.renderMCPs();
        this.updateResultsCount();
    }
    
    renderMCPs() {
        const container = document.getElementById('mcps-grid');
        const noResults = document.getElementById('no-results');
        
        if (this.filteredMcps.length === 0) {
            container.classList.add('hidden');
            noResults.classList.remove('hidden');
            return;
        }
        
        container.classList.remove('hidden');
        noResults.classList.add('hidden');
        
        container.innerHTML = '';
        
        this.filteredMcps.forEach(mcp => {
            const card = this.createMCPCard(mcp);
            container.appendChild(card);
        });
    }
    
    createMCPCard(mcp) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-xl shadow-sm border border-gray-200 card-hover cursor-pointer group';
        
        card.innerHTML = `
            <div class="p-6">
                <!-- Header -->
                <div class="flex items-start justify-between mb-3">
                    <div class="flex-1 min-w-0">
                        <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                            ${mcp.name}
                        </h3>
                        <p class="text-sm text-gray-600 mt-1">by ${mcp.author}</p>
                    </div>
                    <div class="flex items-center space-x-2 ml-4">
                        <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                            ${this.formatCategoryName(mcp.category)}
                        </span>
                    </div>
                </div>
                
                <!-- Description -->
                <p class="text-gray-700 text-sm mb-4 line-clamp-2">
                    ${mcp.description}
                </p>
                
                <!-- Tags -->
                <div class="flex flex-wrap gap-1 mb-4">
                    ${mcp.tags.slice(0, 3).map(tag => `
                        <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                            ${tag}
                        </span>
                    `).join('')}
                    ${mcp.tags.length > 3 ? `
                        <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-500">
                            +${mcp.tags.length - 3} more
                        </span>
                    ` : ''}
                </div>
                
                <!-- Stats -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4 text-sm text-gray-600">
                        <!-- Rating -->
                        <div class="flex items-center space-x-1">
                            <div class="flex items-center">
                                ${this.createStars(mcp.rating)}
                            </div>
                            <span class="font-medium">${mcp.rating}</span>
                        </div>
                        
                        <!-- Downloads -->
                        <div class="flex items-center space-x-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                            </svg>
                            <span>${this.formatDownloads(mcp.downloads)}</span>
                        </div>
                    </div>
                    
                    <!-- Last Updated -->
                    <div class="text-xs text-gray-500">
                        ${this.getTimeAgo(mcp.lastUpdated)}
                    </div>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => {
            this.openModal(mcp);
        });
        
        return card;
    }
    
    createStars(rating) {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push('<svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>');
        }
        
        if (hasHalfStar) {
            stars.push('<svg class="w-4 h-4 text-yellow-400" viewBox="0 0 20 20"><defs><linearGradient id="half"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs><path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>');
        }
        
        while (stars.length < 5) {
            stars.push('<svg class="w-4 h-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>');
        }
        
        return stars.join('');
    }
    
    formatDownloads(downloads) {
        if (downloads >= 1000000) {
            return (downloads / 1000000).toFixed(1) + 'M';
        } else if (downloads >= 1000) {
            return (downloads / 1000).toFixed(1) + 'K';
        }
        return downloads.toString();
    }
    
    getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        
        if (diffInDays < 1) return '오늘';
        if (diffInDays < 7) return `${diffInDays}일 전`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}주 전`;
        if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}개월 전`;
        return `${Math.floor(diffInDays / 365)}년 전`;
    }
    
    updateResultsCount() {
        const count = this.filteredMcps.length;
        const countElement = document.getElementById('results-count');
        countElement.textContent = `${count}개 MCP 발견`;
    }
    
    updateClearButton() {
        const clearButton = document.getElementById('clear-filters');
        if (this.selectedCategory !== 'all' || this.selectedTags.length > 0) {
            clearButton.classList.remove('hidden');
        } else {
            clearButton.classList.add('hidden');
        }
    }
    
    clearAllFilters() {
        this.selectedCategory = 'all';
        this.selectedTags = [];
        
        // Update UI
        document.querySelectorAll('input[name="category"]').forEach(input => {
            input.checked = input.value === 'all';
        });
        
        document.querySelectorAll('input[name="tag"]').forEach(input => {
            input.checked = false;
        });
        
        this.filterAndRender();
        this.updateClearButton();
    }
    
    openModal(mcp) {
        const modal = document.getElementById('modal');
        
        modal.innerHTML = `
            <div class="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <!-- Header -->
                <div class="flex items-start justify-between p-6 border-b border-gray-200">
                    <div class="flex-1 min-w-0">
                        <h2 class="text-2xl font-bold text-gray-900 mb-2">${mcp.name}</h2>
                        <div class="flex items-center space-x-4 text-sm text-gray-600">
                            <span>by <span class="font-medium">${mcp.author}</span></span>
                            <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                                ${this.formatCategoryName(mcp.category)}
                            </span>
                            <div class="flex items-center space-x-1">
                                <div class="flex items-center">
                                    ${this.createStars(mcp.rating)}
                                </div>
                                <span class="font-medium">${mcp.rating}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onclick="mcpMarketplace.closeModal()"
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
                        <h3 class="text-lg font-semibold text-gray-900 mb-3">설명</h3>
                        <p class="text-gray-700 leading-relaxed">${mcp.description}</p>
                    </div>
                    
                    <!-- Details -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h4 class="text-md font-semibold text-gray-900 mb-3">상세 정보</h4>
                            <dl class="space-y-2">
                                <div class="flex justify-between">
                                    <dt class="text-sm text-gray-600">버전:</dt>
                                    <dd class="text-sm font-medium text-gray-900">${mcp.version}</dd>
                                </div>
                                <div class="flex justify-between">
                                    <dt class="text-sm text-gray-600">다운로드:</dt>
                                    <dd class="text-sm font-medium text-gray-900">${mcp.downloads.toLocaleString()}</dd>
                                </div>
                                <div class="flex justify-between">
                                    <dt class="text-sm text-gray-600">라이선스:</dt>
                                    <dd class="text-sm font-medium text-gray-900">${mcp.license}</dd>
                                </div>
                                <div class="flex justify-between">
                                    <dt class="text-sm text-gray-600">마지막 업데이트:</dt>
                                    <dd class="text-sm font-medium text-gray-900">${new Date(mcp.lastUpdated).toLocaleDateString('ko-KR')}</dd>
                                </div>
                            </dl>
                        </div>
                        
                        <div>
                            <h4 class="text-md font-semibold text-gray-900 mb-3">저장소</h4>
                            <a 
                                href="${mcp.repository}" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                class="inline-flex items-center text-blue-600 hover:text-blue-500 text-sm"
                            >
                                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"></path>
                                </svg>
                                GitHub에서 보기
                            </a>
                        </div>
                    </div>
                    
                    <!-- Tags -->
                    <div class="mb-6">
                        <h4 class="text-md font-semibold text-gray-900 mb-3">태그</h4>
                        <div class="flex flex-wrap gap-2">
                            ${mcp.tags.map(tag => `
                                <span class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-50 text-blue-700">
                                    ${tag}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Installation -->
                    <div class="mb-6">
                        <h4 class="text-md font-semibold text-gray-900 mb-3">설치 방법</h4>
                        <div class="bg-gray-50 rounded-md p-4">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-sm font-medium text-gray-700">npm</span>
                                <button
                                    onclick="navigator.clipboard.writeText('npm install ${mcp.packageName}')"
                                    class="text-sm text-blue-600 hover:text-blue-500"
                                >
                                    복사
                                </button>
                            </div>
                            <code class="text-sm text-gray-900 bg-white px-3 py-2 rounded border block">
                                npm install ${mcp.packageName}
                            </code>
                        </div>
                    </div>
                    
                    <!-- Features -->
                    ${mcp.features && mcp.features.length > 0 ? `
                        <div class="mb-6">
                            <h4 class="text-md font-semibold text-gray-900 mb-3">기능</h4>
                            <ul class="space-y-2">
                                ${mcp.features.map(feature => `
                                    <li class="flex items-start">
                                        <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        <span class="text-sm text-gray-700">${feature}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Footer -->
                <div class="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <button
                        onclick="mcpMarketplace.closeModal()"
                        class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                        닫기
                    </button>
                    <a
                        href="${mcp.repository}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                    >
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"></path>
                        </svg>
                        저장소 방문
                    </a>
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
    }
    
    closeModal() {
        document.getElementById('modal').classList.add('hidden');
    }
}

// Initialize the marketplace
const mcpMarketplace = new MCPMarketplace();