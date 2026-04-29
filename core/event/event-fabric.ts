import { bus } from "@/core/event/event-bus.safe";

export type FabricHandler<T = unknown> = (data: T, id?: string) => void | Promise<void>;

type Transport = {
  publish: (event: string, payload: unknown) => Promise<void>;
};

class NoopTransport implements Transport {
  async publish() {
    return;
  }
}

const transport: Transport = new NoopTransport();

export class EventFabric {
  async emit(event: string, payload: unknown) {
    bus.emit(event, payload);
    await transport.publish(event, payload);
  }

  async subscribe(event: string, handler: FabricHandler) {
    bus.on(event, handler);
    return () => bus.off(event, handler);
  }
}

export const eventFabric = new EventFabric();
