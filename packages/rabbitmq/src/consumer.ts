import { Channel, ConsumeMessage } from 'amqplib';
import EventEmitter from 'events';

export class Consumer {
  constructor(
    private readonly channel: Channel,
    private readonly _queueName: string,
  ) {}

  onConsume(
    consumeMessageHandler: (msg: ConsumeMessage, _: EventEmitter) => Promise<void>,
    eventEmitter: EventEmitter,
  ) {
    this.channel.consume(
      this._queueName,
      async (msg) => {
        if (!msg) return;
        await consumeMessageHandler(msg, eventEmitter);
      },
      {
        noAck: true,
      },
    );
  }

  get queueName() {
    return this._queueName;
  }
}
