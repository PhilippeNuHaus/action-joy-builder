import { useState, useEffect } from "react";

interface TypewriterGlowProps {
  text: string;
  typeSpeed?: number;
  eraseSpeed?: number;
  pauseAfterType?: number;
  pauseAfterErase?: number;
}

const TypewriterGlow = ({
  text,
  typeSpeed = 80,
  eraseSpeed = 50,
  pauseAfterType = 2000,
  pauseAfterErase = 500,
}: TypewriterGlowProps) => {
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (isTyping) {
      if (displayed.length < text.length) {
        timeout = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), typeSpeed);
      } else {
        timeout = setTimeout(() => setIsTyping(false), pauseAfterType);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), eraseSpeed);
      } else {
        timeout = setTimeout(() => setIsTyping(true), pauseAfterErase);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayed, isTyping, text, typeSpeed, eraseSpeed, pauseAfterType, pauseAfterErase]);

  return (
    <span className="text-primary animate-text-pulse-glow">
      {displayed}
      <span className="inline-block w-[2px] h-[1em] bg-primary ml-[1px] align-middle animate-pulse" />
    </span>
  );
};

export default TypewriterGlow;
