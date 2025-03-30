import { Channel, Options } from 'amqplib';

export class Producer {
  constructor(private readonly channel: Channel) {}

  async produce<T extends Record<string, unknown>>(
    msg: T,
    correlationId: string,
    queueName: string,
    options?: Options.Publish,
  ) {
    console.log(`Send to queue ${queueName} with correlation ID ${correlationId}`);

    this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(msg)), {
      correlationId,
      ...options,
    });
  }
}
