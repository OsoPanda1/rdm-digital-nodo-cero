import "server-only";

import { getStripeClient } from "@/lib/payments";

export const stripe = getStripeClient();
