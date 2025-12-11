// scripts/benchmark.js
const { performance } = require('perf_hooks');

async function benchmarkAPI(url, label) {
  const start = performance.now();
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    const end = performance.now();
    const duration = (end - start).toFixed(2);
    
    console.log(`✓ ${label}: ${duration}ms`);
    return { success: true, duration, dataSize: JSON.stringify(data).length };
  } catch (error) {
    const end = performance.now();
    console.log(`✗ ${label}: FAILED (${(end - start).toFixed(2)}ms)`);
    return { success: false, duration: end - start };
  }
}

async function runBenchmarks() {
  console.log('🔬 Running Performance Benchmarks...\n');
  
  const baseUrl = process.env.API_URL || 'http://localhost:3001';
  
  console.log('--- Backend API Tests ---');
  await benchmarkAPI(`${baseUrl}/health`, 'Health Check');
  await benchmarkAPI(`${baseUrl}/api/products?mode=admin`, 'Products API');
  await benchmarkAPI(`${baseUrl}/api/categories`, 'Categories API');
  await benchmarkAPI(`${baseUrl}/api/users/email/admin@example.com`, 'User Lookup');
  
  console.log('\n--- Frontend Page Tests ---');
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  const pages = [
    { url: '/', label: 'Home Page' },
    { url: '/login', label: 'Login Page' },
    { url: '/admin', label: 'Admin Dashboard' },
    { url: '/admin/products', label: 'Admin Products' }
  ];
  
  for (const page of pages) {
    const start = performance.now();
    try {
      const response = await fetch(`${frontendUrl}${page.url}`);
      const html = await response.text();
      const end = performance.now();
      console.log(`✓ ${page.label}: ${(end - start).toFixed(2)}ms (${(html.length / 1024).toFixed(2)}KB)`);
    } catch (error) {
      console.log(`✗ ${page.label}: FAILED`);
    }
  }
  
  console.log('\n--- Database Query Simulation ---');
  // Test multiple rapid requests (simulating real usage)
  const rapidTests = 10;
  const rapidStart = performance.now();
  
  const promises = Array(rapidTests).fill(null).map(() => 
    fetch(`${baseUrl}/api/products?mode=admin`)
  );
  
  await Promise.all(promises);
  const rapidEnd = performance.now();
  console.log(`✓ ${rapidTests} Concurrent Requests: ${(rapidEnd - rapidStart).toFixed(2)}ms total`);
  console.log(`  Average: ${((rapidEnd - rapidStart) / rapidTests).toFixed(2)}ms per request`);
}

// Run it
runBenchmarks().then(() => {
  console.log('\n✅ Benchmarks complete!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Benchmark failed:', error);
  process.exit(1);
});