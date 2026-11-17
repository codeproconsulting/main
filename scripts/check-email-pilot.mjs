import { api, loadEnvironment } from './appwrite-client.mjs';
import { schema } from './appwrite-schema.mjs';

const requirements = {
  staff: { fields: ['reminderEmail'], indexes: [] },
  notifications: { fields: Object.keys(schema.notifications.fields), indexes: ['recipient'] },
  email_outbox: { fields: Object.keys(schema.email_outbox.fields), indexes: ['due', 'provider'] },
  email_events: { fields: Object.keys(schema.email_events.fields), indexes: ['provider', 'suppression'] },
  locks: { fields: Object.keys(schema.locks.fields), indexes: [] },
  worker_health: { fields: Object.keys(schema.worker_health.fields), indexes: [] },
};

loadEnvironment();
const database = process.env.APPWRITE_DATABASE_ID;
if (!database) {
  console.error('Set APPWRITE_DATABASE_ID for the release target.');
  process.exitCode = 1;
} else {
  const base = '/databases/' + encodeURIComponent(database) + '/collections/';
  for (const [name, { fields, indexes }] of Object.entries(requirements)) {
    const path = base + name;
    try {
      const [collection, { attributes }, indexList] = await Promise.all([
        api(path), api(path + '/attributes'), indexes.length ? api(path + '/indexes') : null,
      ]);
      const problems = [];
      if (collection.enabled !== true || collection.documentSecurity !== true || collection.$permissions?.length !== 0) {
        problems.push('expected an enabled collection with document security and no collection grants');
      }
      for (const field of fields) {
        const attribute = attributes.find(item => item.key === field);
        const expected = schema[name].fields[field];
        const type = typeof expected === 'number' ? 'string' : expected;
        if (attribute?.status !== 'available' || attribute.type !== type ||
            (type === 'string' && attribute.size < expected)) {
          problems.push(field + ' missing, unavailable or incompatible');
        } else if (name === 'staff' && (attribute.required || (attribute.default ?? '') !== '')) {
          problems.push(field + ' must be optional and default off');
        }
      }
      for (const key of indexes) {
        const index = indexList.indexes.find(item => item.key === key);
        if (index?.status !== 'available' || index.type !== 'key' ||
            JSON.stringify(index.attributes) !== JSON.stringify(schema[name].indexes[key])) {
          problems.push(key + ' index missing, unavailable or incompatible');
        }
      }
      if (problems.length) {
        console.error(name + ': ' + problems.join('; '));
        process.exitCode = 1;
      } else {
        console.log(name + ': ready');
      }
    } catch (error) {
      const status = Number.isInteger(error.status) ? ' (HTTP ' + error.status + ')' : '';
      console.error(name + ': metadata check failed' + status);
      process.exitCode = 1;
    }
  }
}
