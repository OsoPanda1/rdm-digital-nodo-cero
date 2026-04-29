import { BookPiService } from "@/lib/tamv/bookpi"
import { EoctService } from "@/lib/tamv/eoct.service"
import { MsrEngine } from "@/lib/tamv/msr.engine"
import type { ProtocolCommand, ProtocolExecutionResult } from "@/lib/tamv/protocol.types"

export class ProtocolEngine {
  constructor(
    private readonly eoct = new EoctService(),
    private readonly msr = new MsrEngine(),
    private readonly bookpi = new BookPiService(),
  ) {}

  execute(command: ProtocolCommand): ProtocolExecutionResult {
    const decision = this.eoct.evaluate(command)
    const lifecycle = decision.approved ? "accepted" : "rejected"
    const msrEvent = this.msr.createEvent({
      commandId: command.id,
      actorId: command.actorId,
      risk: decision.risk,
      status: lifecycle,
      metadata: command.payload,
    })
    const entry = this.bookpi.publishEntry({
      title: `Protocolo ${command.name} ${lifecycle}`,
      summary: decision.reasons.join(" "),
      tags: ["tamv", "protocol", lifecycle],
    })

    return {
      commandId: command.id,
      decision,
      lifecycle,
      msrEventId: msrEvent.id,
      bookpiEntryId: entry.id,
    }
  }
}
