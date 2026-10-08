const { DynamoDBClient, PutItemCommand, ScanCommand } = require('@aws-sdk/client-dynamodb');
const { randomUUID } = require('node:crypto');
const db = new DynamoDBClient({});
const reply = (statusCode, body) => ({ statusCode, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify(body) });
exports.handler = async event => {
  try {
    if (event.routeKey === 'POST /enquiries') {
      const raw = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString() : event.body || '';
      if (Buffer.byteLength(raw) > 12000) return reply(413, { error: 'Enquiry too large' });
      let data; try { data = JSON.parse(raw); } catch { return reply(400, { error: 'Invalid request' }); }
      if (!data || typeof data !== 'object') return reply(400, { error: 'Invalid request' });
      if (data.website) return reply(400, { error: 'Invalid request' });
      const value = key => typeof data[key] === 'string' ? data[key].trim() : '';
      const name = value('name'), email = value('email'), message = value('message'), referral = value('referral').toUpperCase();
      if (!name || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !message || message.length > 2000 || (referral && !/^[A-Z0-9][A-Z0-9_-]{2,31}$/.test(referral))) return reply(400, { error: 'Invalid enquiry fields' });
      const id = /^[0-9a-f-]{36}$/i.test(value('id')) ? value('id') : randomUUID();
      const record = { id, createdAt: new Date().toISOString(), name, email, message, referral };
      try { await db.send(new PutItemCommand({ TableName: process.env.TABLE, Item: Object.fromEntries(Object.entries(record).map(([key,val])=>[key,{S:val}])), ConditionExpression: 'attribute_not_exists(id)' })); }
      catch (err) { if (err.name !== 'ConditionalCheckFailedException') throw err; }
      return reply(201, { id });
    }
    if (event.routeKey === 'GET /enquiries') {
      // Defense in depth: only access tokens for the dedicated, invitation-only pool/client.
      const claims = event.requestContext?.authorizer?.jwt?.claims;
      if (claims?.token_use !== 'access' || claims?.client_id !== process.env.CLIENT_ID) return reply(403, { error: 'Forbidden' });
      let start;
      const cursor = event.queryStringParameters?.cursor;
      if (cursor) {
        try { const parsed = JSON.parse(Buffer.from(cursor, 'base64url').toString()); if (typeof parsed.id?.S !== 'string' || parsed.id.S.length > 100) throw Error(); start = { id: { S: parsed.id.S } }; }
        catch { return reply(400, { error: 'Invalid cursor' }); }
      }
      const result = await db.send(new ScanCommand({ TableName: process.env.TABLE, Limit: 100, ExclusiveStartKey: start }));
      const items = (result.Items || []).map(item=>Object.fromEntries(Object.entries(item).map(([key,val])=>[key,val.S]))).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
      return reply(200, { items, cursor: result.LastEvaluatedKey ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64url') : null });
    }
    return reply(404, { error: 'Not found' });
  } catch { return reply(500, { error: 'Service unavailable. Please retry.' }); }
};
