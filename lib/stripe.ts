import "server-only";

import { getStripeClient } from "@/lib/payments";

export const stripe = new Proxy(
  {},
  {
    get(_target, prop) {
      const client = getStripeClient() as any
      return client[prop]
    },
  },
) as ReturnType<typeof getStripeClient>
