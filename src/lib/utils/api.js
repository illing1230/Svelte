const API_BASE = import.meta.env.DEV ? 'http://localhost:8000/api' : '/api';

class APIError extends Error {
	constructor(message, status) {
		super(message);
		this.name = 'APIError';
		this.status = status;
	}
}

async function handleResponse(response) {
	if (!response.ok) {
		const error = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
		throw new APIError(error.error || `HTTP ${response.status}`, response.status);
	}
	return response.json();
}

export async function fetchMCPs(params = {}) {
	try {
		const searchParams = new URLSearchParams();
		
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== '') {
				if (Array.isArray(value)) {
					value.forEach(v => searchParams.append(key, v));
				} else {
					searchParams.append(key, value);
				}
			}
		});
		
		const url = `${API_BASE}/mcps${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
		const response = await fetch(url);
		return handleResponse(response);
	} catch (error) {
		if (error instanceof APIError) {
			throw error;
		}
		throw new APIError('Failed to fetch MCPs. Please check your connection and try again.', 0);
	}
}

export async function fetchMCP(id) {
	try {
		const response = await fetch(`${API_BASE}/mcps/${id}`);
		return handleResponse(response);
	} catch (error) {
		if (error instanceof APIError) {
			throw error;
		}
		throw new APIError('Failed to fetch MCP details. Please check your connection and try again.', 0);
	}
}

export async function fetchCategories() {
	try {
		const response = await fetch(`${API_BASE}/categories`);
		return handleResponse(response);
	} catch (error) {
		if (error instanceof APIError) {
			throw error;
		}
		throw new APIError('Failed to fetch categories. Please check your connection and try again.', 0);
	}
}

export async function fetchTags() {
	try {
		const response = await fetch(`${API_BASE}/tags`);
		return handleResponse(response);
	} catch (error) {
		if (error instanceof APIError) {
			throw error;
		}
		throw new APIError('Failed to fetch tags. Please check your connection and try again.', 0);
	}
}
