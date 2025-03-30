import { serve } from '@hono/node-server';
import { requestId } from 'hono/request-id';
import { Hono } from 'hono';

import { getRabbitClient } from './get-rabbit-client';

const app = new Hono();

app.use('*', requestId());

app.get('/health', (c) => {
  return c.text('Healthy!');
});

app.post('/operate', async (c) => {
  const rabbitClient = await getRabbitClient();
  const body = await c.req.json();

  const response = await rabbitClient.produce(body, c.get('requestId'), 'rpc-queue'); // RPC Server queue name

  return c.json(response as Record<string, unknown>);
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  async (info) => {
    console.log(`Server is running on http://${info.address}:${info.port}`);
    (await getRabbitClient()).prepareConsume(async (msg, eventEmitter) => {
      eventEmitter.emit(msg.properties.correlationId.toString(), msg);
    });
  },
);
