import type { ProtocolCommand, ProtocolDecision } from "@/lib/tamv/protocol.types"

type Rule = {
  id: string
  description: string
  check: (command: ProtocolCommand) => string | null
}

const RULES: Rule[] = [
  {
    id: "payload-non-empty",
    description: "El comando debe incluir payload con datos útiles.",
    check: (command) => (Object.keys(command.payload ?? {}).length === 0 ? "Payload vacío." : null),
  },
  {
    id: "safe-command-name",
    description: "El nombre del comando no debe incluir acciones dañinas.",
    check: (command) => (/destroy|delete-all|wipe/i.test(command.name) ? "Comando potencialmente destructivo." : null),
  },
]

export class EoctService {
  evaluate(command: ProtocolCommand): ProtocolDecision {
    const reasons = RULES.map((rule) => rule.check(command)).filter((reason): reason is string => Boolean(reason))
    const approved = reasons.length === 0
    return {
      approved,
      risk: approved ? "low" : "high",
      reasons: approved ? ["Evaluación ética aprobada."] : reasons,
    }
  }
}
