type MsrEventInput = {
  commandId: string
  actorId: string
  risk: "low" | "medium" | "high"
  status: "accepted" | "rejected"
  metadata: Record<string, unknown>
}

export class MsrEngine {
  createEvent(input: MsrEventInput) {
    return {
      id: `msr_${input.commandId}_${Date.now()}`,
      at: new Date().toISOString(),
      ...input,
    }
  }
}
