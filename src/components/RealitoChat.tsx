import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, X, Send, Sparkles, Bot, User, 
  MapPin, Utensils, Camera, History, HelpCircle,
  Clock, Thermometer, Mountain, Calendar, Route,
  AlertCircle, CheckCircle, Volume2, VolumeX, Loader2
} from "lucide-react";
import logoRdm from "@/assets/logo-rdm.png";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Quick suggestions
const suggestions = [
  "¿Qué hacer con 2 horas libres?",
  "Historia del paste y dónde probarlo",
  "Ruta histórica recomendada",
  "Cómo llegar desde CDMX",
  "Festivales y eventos del año",
  "Mejores lugares para fotografía",
  "Información de la Mina de Acosta",
  "Hospedaje y precios",
];

// Sound effects (using Web Audio API)
const playNotificationSound = (type: "message" | "success" | "error") => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === "message") {
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(659.25, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === "success") {
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
    }
  } catch (e) {
    // Audio not supported
  }
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/realito-chat`;

export default function RealitoChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const streamChat = async (userMessage: string) => {
    const apiMessages = messages.map(m => ({
      role: m.role,
      content: m.content
    }));
    apiMessages.push({ role: "user" as const, content: userMessage });

    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: apiMessages }),
    });

    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      throw new Error(errorData.error || "Error al conectar con REALITO");
    }

    if (!resp.body) throw new Error("No response body");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantContent = "";
    let streamDone = false;

    // Create initial assistant message
    const assistantId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date()
    }]);

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setMessages(prev => prev.map(m => 
              m.id === assistantId 
                ? { ...m, content: assistantContent }
                : m
            ));
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    // Final flush
    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (raw.startsWith(":") || raw.trim() === "") continue;
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setMessages(prev => prev.map(m => 
              m.id === assistantId 
                ? { ...m, content: assistantContent }
                : m
            ));
          }
        } catch { /* ignore */ }
      }
    }

    return assistantContent;
  };

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return;
    
    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: "user", 
      content: text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setShowSuggestions(false);

    try {
      await streamChat(text);
      if (soundEnabled) playNotificationSound("success");
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Lo siento, hubo un problema al procesar tu mensaje. Por favor intenta de nuevo. 🙏",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
      if (soundEnabled) playNotificationSound("error");
    } finally {
      setIsTyping(false);
    }
  }, [isTyping, soundEnabled, messages]);

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && soundEnabled) {
      playNotificationSound("message");
    }
  };

  const clearChat = () => {
    setMessages([]);
    setShowSuggestions(true);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 shadow-2xl flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          boxShadow: isOpen 
            ? "0 0 0 0 rgba(245, 158, 11, 0)" 
            : ["0 0 0 0 rgba(245, 158, 11, 0.4)", "0 0 0 20px rgba(245, 158, 11, 0)", "0 0 0 0 rgba(245, 158, 11, 0.4)"]
        }}
        transition={{ 
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-7 h-7 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageCircle className="w-7 h-7 text-white" />
              <Sparkles className="w-4 h-4 text-yellow-200 absolute -top-1 -right-1 animate-pulse" />
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
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[550px] max-h-[calc(100vh-150px)] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-amber-500/30 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 p-4 flex items-center gap-3 shrink-0">
              <div className="relative">
                <img 
                  src={logoRdm} 
                  alt="REALITO" 
                  className="w-12 h-12 rounded-full border-2 border-white/50 object-cover bg-white"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  REALITO
                  <Sparkles className="w-4 h-4 text-yellow-200" />
                </h3>
                <p className="text-white/80 text-xs">Tu guía experto de Real del Monte • IA</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  title={soundEnabled ? "Silenciar" : "Activar sonido"}
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-white" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-white" />
                  )}
                </button>
                <button
                  onClick={clearChat}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  title="Limpiar chat"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              {/* Welcome message */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 rounded-2xl rounded-tl-sm p-4 max-w-[85%] border border-amber-500/20">
                      <p className="text-white/90 text-sm leading-relaxed">
                        ¡Hola! Soy <strong>REALITO</strong>, tu guía virtual de Real del Monte. 🏔️⛏️
                      </p>
                      <p className="text-white/70 text-sm mt-2">
                        Tengo información completa sobre historia, lugares turísticos, gastronomía, rutas, eventos, cultura, servicios y mucho más. ¿En qué puedo ayudarte?
                      </p>
                    </div>
                  </div>

                  {/* Quick Categories */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { icon: History, label: "Historia", color: "from-blue-500 to-blue-600" },
                      { icon: MapPin, label: "Lugares", color: "from-green-500 to-green-600" },
                      { icon: Utensils, label: "Comida", color: "from-orange-500 to-orange-600" },
                      { icon: Route, label: "Rutas", color: "from-purple-500 to-purple-600" },
                    ].map(({ icon: Icon, label, color }) => (
                      <button
                        key={label}
                        onClick={() => sendMessage(`Cuéntame sobre ${label.toLowerCase()} de Real del Monte`)}
                        className={`p-2 rounded-xl bg-gradient-to-br ${color} flex flex-col items-center gap-1 hover:scale-105 transition-transform`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                        <span className="text-white text-xs">{label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Messages */}
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex items-start gap-3 mb-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "user" 
                      ? "bg-gradient-to-br from-blue-500 to-blue-600" 
                      : "bg-gradient-to-br from-amber-400 to-orange-500"
                  }`}>
                    {msg.role === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`rounded-2xl p-3 max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 rounded-tr-sm"
                      : "bg-gradient-to-br from-slate-700/80 to-slate-800/80 rounded-tl-sm border border-amber-500/20"
                  }`}>
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="text-white/90 text-sm leading-relaxed mb-2 last:mb-0">{children}</p>,
                            strong: ({ children }) => <strong className="text-amber-400">{children}</strong>,
                            ul: ({ children }) => <ul className="text-white/90 text-sm list-disc pl-4 mb-2">{children}</ul>,
                            ol: ({ children }) => <ol className="text-white/90 text-sm list-decimal pl-4 mb-2">{children}</ol>,
                            li: ({ children }) => <li className="mb-1">{children}</li>,
                            h1: ({ children }) => <h1 className="text-amber-400 font-bold text-base mb-2">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-amber-400 font-bold text-sm mb-2">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-amber-400 font-semibold text-sm mb-1">{children}</h3>,
                          }}
                        >
                          {msg.content || "..."}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-white/90 text-sm leading-relaxed">{msg.content}</p>
                    )}
                    <span className="text-white/40 text-xs mt-1 block">
                      {msg.timestamp.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && messages[messages.length - 1]?.role === "user" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 mb-4"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </div>
                  <div className="bg-slate-700/50 rounded-2xl rounded-tl-sm px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Suggestions */}
              {showSuggestions && messages.length === 0 && (
                <div className="space-y-2">
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Sugerencias</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1.5 bg-slate-700/50 hover:bg-amber-500/20 border border-slate-600 hover:border-amber-500/50 rounded-full text-white/80 text-xs transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700/50 shrink-0">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pregunta sobre Real del Monte..."
                  className="flex-1 bg-slate-700/50 border border-slate-600 focus:border-amber-500 rounded-xl px-4 py-3 text-white placeholder:text-white/40 text-sm outline-none transition-colors"
                  disabled={isTyping}
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl px-4 disabled:opacity-50"
                >
                  {isTyping ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
              <p className="text-center text-white/30 text-xs mt-2">
                Powered by Lovable AI • gemini-2.5-flash
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
