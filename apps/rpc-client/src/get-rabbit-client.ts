import { RabbitDuplexClient } from '@local/rabbitmq';

let rabbitClient: RabbitDuplexClient | null = null;

export const getRabbitClient = async (): Promise<RabbitDuplexClient> => {
  if (rabbitClient) {
    return rabbitClient;
  }

  const _client = await RabbitDuplexClient.register({
    url: 'amqp://localhost',
    queues: {
      server: false,
    },
  });

  rabbitClient = _client;

  return rabbitClient;
};
