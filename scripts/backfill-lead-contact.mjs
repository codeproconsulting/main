import { pathToFileURL } from 'node:url';
import { api, loadEnvironment, q } from './appwrite-client.mjs';
import { emailKey, phoneKey } from '../app/lib/lead-contact.ts';

export async function backfillLeadContact({ database, apply = false, request = api }) {
  if (!database) throw new Error('Set APPWRITE_DATABASE_ID');
  const path = '/databases/' + encodeURIComponent(database) + '/collections/leads/documents';
  const fields = ['$id', 'email', 'phone', 'emailKey', 'phoneKey'];
  let cursor, scanned = 0, changes = 0, unsearchablePhones = 0;

  while (true) {
    const search = new URLSearchParams();
    for (const query of [
      q('select', undefined, fields), q('orderAsc', '$id'), q('limit', undefined, [100]),
      ...(cursor ? [q('cursorAfter', undefined, [cursor])] : []),
    ]) search.append('queries[]', query);
    const { documents } = await request(path + '?' + search);
    for (const lead of documents) {
      scanned++;
      const email = emailKey(lead.email ?? '');
      const phone = phoneKey(lead.phone ?? '');
      if (!phone) unsearchablePhones++;
      if (email === (lead.emailKey ?? '') && phone === (lead.phoneKey ?? '')) continue;
      changes++;
      if (apply) await request(path + '/' + encodeURIComponent(lead.$id), 'PATCH', { data: { emailKey: email, phoneKey: phone } });
    }
    if (documents.length < 100) break;
    const next = documents.at(-1).$id;
    if (!next || next === cursor) throw new Error('Cursor did not advance');
    cursor = next;
  }
  return { scanned, changes, unsearchablePhones };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  loadEnvironment();
  const apply = process.argv.includes('--apply');
  try {
    const result = await backfillLeadContact({ database: process.env.APPWRITE_DATABASE_ID, apply });
    console.log(`${apply ? 'Updated' : 'Would update'} ${result.changes} of ${result.scanned} leads. ${result.unsearchablePhones} have no normalizable phone.`);
  } catch (error) {
    console.error(`Contact backfill stopped (HTTP ${error.status ?? 'unknown'}). Resolve the issue and rerun.`);
    process.exitCode = 1;
  }
}
