import { Kafka, Producer } from 'kafkajs';
import { IAnalyticPayload, IAnalyticProvider, IAnalyticSource, IKafkaTransportOptions } from '../types';

export class KafkaService {
  private producer: Producer;
  private topic: string;

  constructor(private options: IKafkaTransportOptions) {
    const kafka = new Kafka({
      clientId: this.options.clientId,
      brokers: this.options.brokers,
    });

    this.topic = options.topic;
    this.producer = kafka.producer();
  }

  async connect() {
    await this.producer.connect();
  }

  async disconnect() {
    await this.producer.disconnect();
  }

  async produce(value:{
    provider: IAnalyticProvider;
    source: IAnalyticSource;
    event: IAnalyticPayload
  }) {
    await this.producer.send({
      topic: this.topic,
      messages: [{ value: JSON.stringify(value) }],
    });
  }
}
