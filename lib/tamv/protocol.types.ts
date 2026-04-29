export type ProtocolRiskLevel = "low" | "medium" | "high"

export type ProtocolCommand = {
  id: string
  actorId: string
  name: string
  payload: Record<string, unknown>
}

export type ProtocolDecision = {
  approved: boolean
  risk: ProtocolRiskLevel
  reasons: string[]
}

export type ProtocolExecutionResult = {
  commandId: string
  decision: ProtocolDecision
  lifecycle: "accepted" | "rejected"
  msrEventId: string
  bookpiEntryId: string
}
