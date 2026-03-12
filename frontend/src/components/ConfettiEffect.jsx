import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function ConfettiEffect({ trigger }) {

  useEffect(() => {
    if (trigger) {
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.6 }
      });
    }
  }, [trigger]);

  return null;
}