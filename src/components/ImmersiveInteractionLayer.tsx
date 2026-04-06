import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const supportsFinePointer = () => window.matchMedia("(pointer:fine)").matches;

const ImmersiveInteractionLayer = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [cursor, setCursor] = useState({ x: -200, y: -200, enabled: false });

  useEffect(() => {
    if (!supportsFinePointer()) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      setCursor({ x: event.clientX, y: event.clientY, enabled: true });
    };

    const handlePointerDown = (event: PointerEvent) => {
      const id = Date.now() + Math.random();
      setRipples((prev) => [...prev, { id, x: event.clientX, y: event.clientY }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
      }, 900);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden" aria-hidden>
      {cursor.enabled && (
        <motion.div
          className="immersive-cursor-aura"
          animate={{ x: cursor.x - 120, y: cursor.y - 120 }}
          transition={{ type: "spring", damping: 25, stiffness: 260, mass: 0.25 }}
        />
      )}

      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="immersive-click-ripple"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}
    </div>
  );
};

export default ImmersiveInteractionLayer;
