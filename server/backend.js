const http = require('http');
const url = require('url');

// Backend server configuration
const PORT = process.env.BACKEND_PORT || 3001;
const HOST = 'localhost';

// Create HTTP server
const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  // Health check endpoint
  if (path === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'AI Receptionist Backend'
    }));
    return;
  }

  // Backend API endpoint
  if (path === '/api/backend/status' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'Backend server is running',
      port: PORT,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Default response for unknown routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    error: 'Not Found',
    message: 'Backend endpoint not found'
  }));
});

// Start server
server.listen(PORT, HOST, () => {
  console.log(`🚀 Backend server running at http://${HOST}:${PORT}`);
  console.log(`📊 Health check: http://${HOST}:${PORT}/health`);
  console.log(`🔗 Status endpoint: http://${HOST}:${PORT}/api/backend/status`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Backend server shutting down...');
  server.close(() => {
    console.log('✅ Backend server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Backend server shutting down...');
  server.close(() => {
    console.log('✅ Backend server closed');
    process.exit(0);
  });
});

