import express from 'express';
import { handler } from './build/handler.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 8000;

// CORS middleware
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	if (req.method === 'OPTIONS') {
		res.sendStatus(200);
	} else {
		next();
	}
});

app.use(express.json());

// API routes
app.get('/api/mcps', (req, res) => {
	try {
		const mcpsPath = path.join(__dirname, 'data', 'mcps.json');
		const mcpsData = JSON.parse(fs.readFileSync(mcpsPath, 'utf8'));
		
		const { search, category, tag, sort } = req.query;
		let filteredMcps = mcpsData.mcps;

		// Search filter
		if (search) {
			const searchTerm = search.toLowerCase();
			filteredMcps = filteredMcps.filter(mcp => 
				mcp.name.toLowerCase().includes(searchTerm) ||
				mcp.description.toLowerCase().includes(searchTerm) ||
				mcp.tags.some(tag => tag.toLowerCase().includes(searchTerm))
			);
		}

		// Category filter
		if (category && category !== 'all') {
			filteredMcps = filteredMcps.filter(mcp => mcp.category === category);
		}

		// Tag filter
		if (tag) {
			filteredMcps = filteredMcps.filter(mcp => mcp.tags.includes(tag));
		}

		// Sort
		if (sort) {
			switch (sort) {
				case 'popularity':
					filteredMcps.sort((a, b) => b.downloads - a.downloads);
					break;
				case 'rating':
					filteredMcps.sort((a, b) => b.rating - a.rating);
					break;
				case 'newest':
					filteredMcps.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
					break;
				case 'name':
					filteredMcps.sort((a, b) => a.name.localeCompare(b.name));
					break;
			}
		}

		res.json({ mcps: filteredMcps });
	} catch (error) {
		console.error('Error loading MCPs:', error);
		res.status(500).json({ error: 'Failed to load MCPs' });
	}
});

app.get('/api/mcps/:id', (req, res) => {
	try {
		const mcpsPath = path.join(__dirname, 'data', 'mcps.json');
		const mcpsData = JSON.parse(fs.readFileSync(mcpsPath, 'utf8'));
		
		const mcp = mcpsData.mcps.find(m => m.id === req.params.id);
		
		if (!mcp) {
			return res.status(404).json({ error: 'MCP not found' });
		}
		
		res.json(mcp);
	} catch (error) {
		console.error('Error loading MCP:', error);
		res.status(500).json({ error: 'Failed to load MCP' });
	}
});

app.get('/api/categories', (req, res) => {
	try {
		const mcpsPath = path.join(__dirname, 'data', 'mcps.json');
		const mcpsData = JSON.parse(fs.readFileSync(mcpsPath, 'utf8'));
		
		const categories = [...new Set(mcpsData.mcps.map(mcp => mcp.category))];
		res.json({ categories });
	} catch (error) {
		console.error('Error loading categories:', error);
		res.status(500).json({ error: 'Failed to load categories' });
	}
});

app.get('/api/tags', (req, res) => {
	try {
		const mcpsPath = path.join(__dirname, 'data', 'mcps.json');
		const mcpsData = JSON.parse(fs.readFileSync(mcpsPath, 'utf8'));
		
		const tags = [...new Set(mcpsData.mcps.flatMap(mcp => mcp.tags))];
		res.json({ tags });
	} catch (error) {
		console.error('Error loading tags:', error);
		res.status(500).json({ error: 'Failed to load tags' });
	}
});

// SvelteKit handler
app.use(handler);

app.listen(PORT, '0.0.0.0', () => {
	console.log(`Server running on http://0.0.0.0:${PORT}`);
});
