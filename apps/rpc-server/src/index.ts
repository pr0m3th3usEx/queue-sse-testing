import { getRabbitClient } from './get-rabbit-client';

(async () => {
  (await getRabbitClient()).prepareConsume(async (msg) => {
    const rabbitClient = await getRabbitClient();
    console.log('[+] Message received');

    const { correlationId, replyTo } = msg.properties;
    console.log(correlationId, replyTo);

    if (!correlationId || !replyTo) return;

    const data = JSON.parse(msg.content.toString());
    console.log(data);

    rabbitClient.produce({ status: 'done' }, correlationId, replyTo);
  });
})();
