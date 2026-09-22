const app = require('../src/app');
const EventEmitter = require('events');

function createMockReqRes(options) {
  const req = new EventEmitter();
  req.method = options.method || 'GET';
  req.url = options.url || '/';
  req.originalUrl = options.url || '/';
  req.headers = options.headers || {};
  req.body = options.body || {};
  req.query = options.query || {};
  req.params = options.params || {};
  req.socket = { remoteAddress: '127.0.0.1' };
  req.connection = req.socket;

  const res = new EventEmitter();
  res.statusCode = 200;
  res.headers = {};
  res.setHeader = (k, v) => { res.headers[k] = v; };
  res.getHeader = (k) => res.headers[k];
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  let resolvePromise;
  const promise = new Promise((resolve) => { resolvePromise = resolve; });

  res.json = (data) => {
    res.body = data;
    resolvePromise({ status: res.statusCode, body: data });
    return res;
  };
  res.send = (data) => {
    res.body = data;
    resolvePromise({ status: res.statusCode, body: data });
    return res;
  };
  res.end = (data) => {
    if (data && !res.body) res.body = data;
    resolvePromise({ status: res.statusCode, body: res.body });
    return res;
  };

  return { req, res, promise };
}

async function runTests() {
  console.log('🧪 Starting Direct In-Memory Express Route Verification...\n');

  // 1. Health check test
  {
    const { req, res, promise } = createMockReqRes({ method: 'GET', url: '/api/v1/health' });
    app.handle(req, res);
    const result = await promise;
    console.log('1. Health Check:', result);
    if (result.status === 200 && result.body.status === 'online' && result.body.appName === 'VGI CAMPUS') {
      console.log('  ✅ PASS: /api/v1/health returned valid online status\n');
    } else {
      console.error('  ❌ FAIL: /api/v1/health failed');
      process.exit(1);
    }
  }

  // 2. 404 Not Found Handler test
  {
    const { req, res, promise } = createMockReqRes({ method: 'GET', url: '/api/v1/unknown-endpoint' });
    app.handle(req, res);
    const result = await promise;
    console.log('2. 404 Handler Check:', result);
    if (result.status === 404 && result.body.error?.code === 'NOT_FOUND') {
      console.log('  ✅ PASS: 404 Handler returned standardized JSON error\n');
    } else {
      console.error('  ❌ FAIL: 404 handler failed');
      process.exit(1);
    }
  }

  // 3. Auth login validation test (missing body)
  {
    const { req, res, promise } = createMockReqRes({
      method: 'POST',
      url: '/api/v1/auth/login',
      body: {}
    });
    app.handle(req, res);
    const result = await promise;
    console.log('3. Auth Validation Check:', result);
    if (result.status === 400 && result.body.error?.code === 'VALIDATION_ERROR') {
      console.log('  ✅ PASS: Auth validation returned expected 400 VALIDATION_ERROR\n');
    } else {
      console.error('  ❌ FAIL: Auth validation failed');
      process.exit(1);
    }
  }

  // 4. Unauthorized access test (accessing protected route without token)
  {
    const { req, res, promise } = createMockReqRes({
      method: 'GET',
      url: '/api/v1/academic/departments'
    });
    app.handle(req, res);
    const result = await promise;
    console.log('4. Protected Route Check:', result);
    if (result.status === 401 && result.body.error?.code === 'UNAUTHORIZED') {
      console.log('  ✅ PASS: Protected endpoint rejected unauthenticated request\n');
    } else {
      console.error('  ❌ FAIL: Protected route check failed');
      process.exit(1);
    }
  }

  console.log('🎉 ALL IN-MEMORY INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
}

runTests().catch(err => {
  console.error('Fatal error during test:', err);
  process.exit(1);
});
