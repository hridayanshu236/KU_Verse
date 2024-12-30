import React, { useState, useEffect } from "react";

const DynamicTextComponent = () => {
  const texts = [
    "Stay Informed. Stay Connected. Stay KU.",
    "For KU students by KU students",
  ];
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timer;
    if (isTyping) {
      if (displayText.length < texts[textIndex].length) {
        timer = setTimeout(() => {
          setDisplayText(texts[textIndex].slice(0, displayText.length + 1));
        }, 50);
      } else {
        timer = setTimeout(() => setIsTyping(false), 3000);
      }
    } else {
      if (displayText.length === 0) {
        setTextIndex((prev) => (prev + 1) % texts.length);
        setIsTyping(true);
      } else {
        timer = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 30);
      }
    }
    return () => clearTimeout(timer);
  }, [displayText, isTyping, textIndex, texts]);

  return (
    <div className="relative h-[60vh] w-full overflow-hidden bg-gradient-to-br from-purple-800 via-indigo-700 to-purple-800">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 -left-10 -top-10 bg-purple-600/25 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
        <div className="absolute w-96 h-96 -right-10 -top-10 bg-indigo-600/25 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
        <div className="absolute w-96 h-96 -bottom-10 left-1/2 bg-pink-600/25 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
      </div>

      {/* Floating KU blocks */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute bg-white/5 backdrop-blur-sm rounded-lg p-2 text-white/65 text-sm font-bold"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float-ku ${
              6 + Math.random() * 4
            }s infinite cubic-bezier(0.4, 0, 0.2, 1)`,
          }}
        >
          KU
        </div>
      ))}

      {/* Main text */}
      <div className="relative z-10 flex h-full w-full items-center justify-center px-4">
        <span className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-50 to-white text-center tracking-tight leading-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          {displayText}
        </span>
      </div>

      <style jsx global>{`
        @keyframes float-ku {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 0.2;
          }
          50% {
            transform: translate(
                ${Math.random() > 0.5 ? "-" : ""}${10 + Math.random() * 20}vw,
                -${30 + Math.random() * 50}vh
              )
              rotate(${Math.random() * 360}deg)
              scale(${0.5 + Math.random() * 0.5});
            opacity: 0.65;
          }
        }
      `}</style>
    </div>
  );
};

export default DynamicTextComponent;
