import { ChannelModel, connect, ConsumeMessage } from 'amqplib';
import { Consumer } from './consumer';
import { Producer } from './producer';
import EventEmitter from 'events';

type RabbitDuplexClientConfig = {
  url: string;
  queues: RabbitDuplexClientQueueConfig;
};

type RabbitDuplexClientQueueConfig = RabbitDuplexClientQueueServerConfig | RabbitDuplexClientQueueClientConfig;

type RabbitDuplexClientQueueClientConfig = {
  server: false;
};

type RabbitDuplexClientQueueServerConfig = {
  server: true;
  rpcQueue: string;
};

export class RabbitDuplexClient {
  constructor(
    private _connection: ChannelModel,
    private _producer: Producer,
    private _consumer: Consumer,
    private readonly server: boolean,
    private eventEmitter: EventEmitter,
  ) {}

  static async register(config: RabbitDuplexClientConfig): Promise<RabbitDuplexClient> {
    try {
      const connection = await connect(config.url);

      const producerChannel = await connection.createChannel();
      const consumerChannel = await connection.createChannel();

      const { queue: consumerQueueName } = await consumerChannel.assertQueue(
        config.queues.server ? config.queues.rpcQueue : '',
        {
          exclusive: true,
        },
      );

      const producer = new Producer(producerChannel);
      const consumer = new Consumer(consumerChannel, consumerQueueName);

      const client = new RabbitDuplexClient(connection, producer, consumer, config.queues.server, new EventEmitter());

      console.log('RabbitMQ client ready');

      return client;
    } catch (err) {
      console.error('Failed to initialize RabbitMQ...', { err });
      throw err;
    }
  }

  async prepareConsume(messageHandler: (msg: ConsumeMessage, eventEmitter: EventEmitter) => Promise<void>) {
    this._consumer.onConsume(messageHandler, this.eventEmitter);
  }

  async produce<T extends Record<string, unknown>>(data: T, correlationId: string, queueName: string) {
    await this._producer.produce(data, correlationId, queueName, {
      replyTo: !this.server ? this._consumer.queueName : undefined,
    });

    if (!this.server) {
      return new Promise((resolve) => {
        this.eventEmitter.once(correlationId, (message: ConsumeMessage) => {
          const data = JSON.parse(message.content.toString());
          resolve(data);
        });
      });
    }
  }
}

export default RabbitDuplexClient;
