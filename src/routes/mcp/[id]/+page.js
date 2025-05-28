import { error } from '@sveltejs/kit';
import { fetchMCP } from '../../../lib/utils/api.js';

export async function load({ params }) {
	try {
		const mcp = await fetchMCP(params.id);
		return {
			mcp
		};
	} catch (err) {
		throw error(404, {
			message: 'MCP not found'
		});
	}
}
