const origin = 'https://crm.proconsulting.uk';
const loginPath = '/admin/login';

async function check(label, url, expectedStatus, inspect = () => null) {
  try {
    const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(8000) });
    await response.body?.cancel();
    const issue = response.status !== expectedStatus
      ? 'expected HTTP ' + expectedStatus + ', got ' + response.status
      : inspect(response.headers);
    if (issue) {
      console.error(label + ': ' + issue);
      process.exitCode = 1;
    } else {
      console.log(label + ': passed');
    }
  } catch (error) {
    const code = error.cause?.code;
    console.error(label + ': connection failed' + (code ? ' (' + code + ')' : ''));
    process.exitCode = 1;
  }
}

const privateNoStore = headers => {
  const directives = (headers.get('cache-control') ?? '').toLowerCase().split(',').map(item => item.trim());
  return directives.includes('private') && directives.includes('no-store') ? null : 'expected private, no-store caching';
};

await Promise.all([
  check('HTTP redirect', 'http://crm.proconsulting.uk' + loginPath, 308,
    headers => headers.get('location') === origin + loginPath ? null : 'redirect target did not match the CRM login URL'),
  check('HTTPS login', origin + loginPath, 200,
    headers => headers.get('content-type')?.startsWith('text/html') ? privateNoStore(headers) : 'expected an HTML login page'),
  check('Anonymous mobile API', origin + '/admin/mobile/v1/workspace', 401,
    headers => headers.get('content-type')?.startsWith('application/json') ? privateNoStore(headers) : 'expected a JSON response'),
]);
