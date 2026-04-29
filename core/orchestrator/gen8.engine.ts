export type Decision = {
  priority: number;
  action: string;
  payload: unknown;
};

export class Gen8Engine {
  evaluate(input: { speed?: number; poiNearby?: unknown }): Decision[] {
    const decisions: Decision[] = [];

    if ((input.speed ?? 0) > 2) {
      decisions.push({ priority: 10, action: "reduce_ar_complexity", payload: {} });
    }

    if (input.poiNearby) {
      decisions.push({ priority: 100, action: "trigger_experience", payload: input.poiNearby });
    }

    return decisions.sort((a, b) => b.priority - a.priority);
  }
}
