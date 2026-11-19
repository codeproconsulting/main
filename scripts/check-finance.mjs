import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { api, loadEnvironment } from './appwrite-client.mjs';
import { schema } from './appwrite-schema.mjs';
import { scanDocument } from '../app/admin/document-scan.server.ts';

export async function checkFinance({ request, database, bucket, scan }) {
  const results = [];
  for (const name of ['expenses', 'expense_budgets', 'activities', 'locks']) {
    try {
      const path = '/databases/' + encodeURIComponent(database) + '/collections/' + name;
      const [collection, { attributes }, { indexes }] = await Promise.all([
        request(path), request(path + '/attributes'), request(path + '/indexes'),
      ]);
      const definition = schema[name];
      const privateCollection = collection.enabled === true && collection.documentSecurity === true &&
        Array.isArray(collection.$permissions) && collection.$permissions.length === 0;
      const fieldsReady = Object.entries(definition.fields).every(([key, expected]) => {
        const found = attributes.find(attribute => attribute.key === key);
        return found?.status === 'available' && found.type === (typeof expected === 'number' ? 'string' : expected) &&
          (typeof expected !== 'number' || found.size >= expected);
      });
      const indexesReady = Object.entries(definition.indexes).every(([key, expected]) => {
        const found = indexes.find(index => index.key === key);
        return found?.status === 'available' && found.type === 'key' &&
          JSON.stringify(found.attributes) === JSON.stringify(expected);
      });
      results.push({ check: name, passed: privateCollection && fieldsReady && indexesReady });
    } catch { results.push({ check: name, passed: false }); }
  }
  try {
    const config = await request('/storage/buckets/' + encodeURIComponent(bucket));
    results.push({ check: 'receipt bucket', passed: config.enabled === true && config.fileSecurity === true &&
      config.encryption === true && config.antivirus === true && Array.isArray(config.$permissions) &&
      config.$permissions.length === 0 && config.maximumFileSize >= 5 * 1024 * 1024 &&
      ['pdf', 'png', 'jpg', 'jpeg'].every(extension => config.allowedFileExtensions?.includes(extension)) });
  } catch { results.push({ check: 'receipt bucket', passed: false }); }
  if (scan) {
    try {
      await scan(new Uint8Array(Buffer.from('%PDF-1.4\nSynthetic finance readiness probe\n%%EOF')));
      results.push({ check: 'scanner clean-file response', passed: true });
    } catch { results.push({ check: 'scanner clean-file response', passed: false }); }
  }
  return results;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  loadEnvironment();
  if (!process.env.APPWRITE_DATABASE_ID) {
    console.error('Set APPWRITE_DATABASE_ID.');
    process.exitCode = 1;
  } else {
    const results = await checkFinance({
      request: api, database: process.env.APPWRITE_DATABASE_ID,
      bucket: process.env.APPWRITE_DOCUMENT_BUCKET || 'crm-documents',
      scan: process.argv.includes('--scanner') ? scanDocument : undefined,
    });
    for (const result of results) console.log(result.check + ': ' + (result.passed ? 'passed' : 'FAILED'));
    if (results.some(result => !result.passed)) process.exitCode = 1;
  }
}
