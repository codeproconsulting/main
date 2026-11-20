import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const origin = 'https://crm.proconsulting.uk';
const loginPath = '/admin/login';

async function check(request, label, url, expectedStatus, inspect = () => null) {
  try {
    const response = await request(url, { redirect: 'manual', signal: AbortSignal.timeout(8000) });
    await response.body?.cancel();
    const issue = response.status !== expectedStatus
      ? 'expected HTTP ' + expectedStatus + ', got ' + response.status
      : inspect(response.headers);
    return { label, issue };
  } catch (error) {
    const code = error.cause?.code;
    return { label, issue: 'connection failed' + (code ? ' (' + code + ')' : '') };
  }
}

const privateNoStore = headers => {
  const directives = (headers.get('cache-control') ?? '').toLowerCase().split(',').map(item => item.trim());
  return directives.includes('private') && directives.includes('no-store') ? null : 'expected private, no-store caching';
};

export async function checkCrmEdge({ request = fetch, finance = false } = {}) {
  const mobile = headers => headers.get('content-type')?.startsWith('application/json') ? privateNoStore(headers) : 'expected a JSON response';
  return Promise.all([
  check(request, 'HTTP redirect', 'http://crm.proconsulting.uk' + loginPath, 308,
    headers => headers.get('location') === origin + loginPath ? null : 'redirect target did not match the CRM login URL'),
  check(request, 'HTTPS login', origin + loginPath, 200,
    headers => headers.get('content-type')?.startsWith('text/html') ? privateNoStore(headers) : 'expected an HTML login page'),
  check(request, 'Anonymous mobile API', origin + '/admin/mobile/v1/workspace', 401,
    mobile),
  ...(finance ? ['finance', 'finance-year'].map(resource =>
    check(request, 'Anonymous ' + resource + ' API', origin + '/admin/mobile/v1/' + resource, 401, mobile)) : []),
]);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const results = await checkCrmEdge({ finance: process.argv.includes('--finance') });
  for (const { label, issue } of results) console[issue ? 'error' : 'log'](label + ': ' + (issue || 'passed'));
  if (results.some(result => result.issue)) process.exitCode = 1;
}
