import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import logoRdm from "@/assets/logo-rdm.png";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
}

const suggestions = [
  "¿Qué hacer con 2 horas libres?",
  "¿Dónde comer el mejor paste?",
  "Ruta histórica a pie",
  "¿Qué ver con niños?",
  "Leyendas de Real del Monte",
];

// Simple local responses while backend isn't connected
function getLocalResponse(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("paste") || lower.includes("comer"))
    return "¡Los pastes son imperdibles! Te recomiendo **Pastes El Portal** en la Plaza Principal, con receta original cornish desde 1985. Prueba el de mole o el tradicional de papa con carne. También **Café La Neblina** tiene postres increíbles. 🥟";
  if (lower.includes("2 horas") || lower.includes("poco tiempo"))
    return "Con 2 horas te sugiero: 1️⃣ Visita la **Plaza Principal** y la Parroquia. 2️⃣ Camina por los callejones coloniales. 3️⃣ Come un paste en **El Portal**. 4️⃣ Si alcanzas, asómate al **Museo del Paste**. ¡Una experiencia compacta pero mágica! ⏱️";
  if (lower.includes("historia") || lower.includes("ruta") || lower.includes("pie"))
    return "La **Ruta Histórica a Pie** dura ~3 horas: Plaza Principal → Parroquia de la Asunción → Calles coloniales → Casa de la Cultura → Mina de Acosta → Panteón Inglés. ¡Lleva zapatos cómodos y cámara! 🚶‍♂️📸";
  if (lower.includes("niño") || lower.includes("familia"))
    return "Con niños te recomiendo: 🎢 **Mina de Acosta** (les encanta bajar en el trenecito). 🏛️ **Museo del Paste** (taller para hacer pastes). 🪨 **Peñas Cargadas** (caminata fácil con rocas gigantes). ¡Y muchos pastes de postre!";
  if (lower.includes("leyenda"))
    return "Real del Monte tiene leyendas fascinantes: 👻 La del **minero fantasma** que recorre los túneles de la Mina de Acosta. 💀 Los relatos del **Panteón Inglés** y los espíritus cornish. 🌫️ La neblina que según los locales trae consigo ecos del pasado minero. ¡Pregunta en el pueblo, cada habitante tiene una historia!";
  return "¡Hola! Soy **REALITO**, tu guía digital de Real del Monte. 🏔️ Puedo ayudarte con rutas, lugares, gastronomía, historia y leyendas del Pueblo Mágico. ¿Qué te gustaría saber?";
}

export default function RealitoChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate delay
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));

    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "bot",
      content: getLocalResponse(text),
    };
    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
  };

  return (
    <>
      {/* FAB Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-lg flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(18,45%,48%), hsl(43,65%,52%))" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] rounded-2xl shadow-2xl border border-border bg-background flex flex-col overflow-hidden"
            style={{ height: 500, maxHeight: "70vh" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border" style={{ background: "linear-gradient(135deg, hsl(18,45%,48%), hsl(43,65%,52%))" }}>
              <img src={logoRdm} alt="REALITO" className="w-9 h-9 rounded-full bg-white/20 object-contain p-0.5" />
              <div className="flex-1">
                <h3 className="text-white font-bold text-sm">REALITO</h3>
                <p className="text-white/70 text-[11px]">Guía digital de Real del Monte</p>
              </div>
              <Sparkles className="w-5 h-5 text-white/60" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-6">
                  <img src={logoRdm} alt="REALITO" className="w-16 h-16 mx-auto mb-3 opacity-60" />
                  <p className="text-sm text-muted-foreground mb-4">
                    ¡Hola! Soy <strong>REALITO</strong>, tu guía del Pueblo Mágico. ¿En qué te ayudo?
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="px-3 py-1.5 rounded-full text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    {m.content.split("**").map((part, i) =>
                      i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-muted-foreground/50"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border p-3 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Pregúntale a REALITO..."
                className="flex-1 bg-muted rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/60"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:bg-primary/90 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
