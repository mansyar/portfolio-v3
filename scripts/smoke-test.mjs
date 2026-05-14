/**
 * Smoke Test — Post-deployment verification script
 *
 * Performs an HTTP GET on the production URL and validates:
 * - HTTP 200 response status
 * - HTML content-type header
 * - <title> contains expected keywords
 * - strict-transport-security header presence (security best practice)
 *
 * Usage: node scripts/smoke-test.mjs
 * Requires: Node.js 18+ (native fetch)
 */

const TARGET_URL = 'https://portfolio-os.ansyar-world.top';

let exitCode = 0;

function pass(message) {
  console.log(`  ✅ PASS: ${message}`);
}

function fail(message) {
  console.log(`  ❌ FAIL: ${message}`);
  exitCode = 1;
}

async function run() {
  console.log(`\n🔍 Smoke Test — ${TARGET_URL}\n`);

  try {
    const response = await fetch(TARGET_URL);

    // Check 1: HTTP 200
    if (response.status === 200) {
      pass(`HTTP ${response.status} — OK`);
    } else {
      fail(`Expected HTTP 200, got ${response.status}`);
    }

    // Check 2: Content-Type contains text/html
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      pass(`Content-Type: ${contentType}`);
    } else {
      fail(`Expected text/html content-type, got: ${contentType}`);
    }

    // Check 3: strict-transport-security header
    const hsts = response.headers.get('strict-transport-security');
    if (hsts) {
      pass(`HSTS header present: ${hsts}`);
    } else {
      fail('Missing strict-transport-security header');
    }

    // Check 4: Title tag content
    const html = await response.text();
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch) {
      const title = titleMatch[1];
      if (/luna|portfolio|os/i.test(title)) {
        pass(`Title contains expected keyword: "${title}"`);
      } else {
        fail(`Title "${title}" doesn't contain expected keywords (Luna/Portfolio/OS)`);
      }
    } else {
      fail('No <title> tag found in response HTML');
    }
  } catch (err) {
    fail(`Network error: ${err.message}`);
  }

  console.log('');
  if (exitCode === 0) {
    console.log('🎉 All smoke tests passed!');
  } else {
    console.log('❌ Some smoke tests failed.');
  }
  process.exit(exitCode);
}

run();
