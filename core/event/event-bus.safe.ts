import { EventEmitter } from "node:events";

class SafeEventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(200);
  }
}

export const bus = new SafeEventBus();
