import React from "react";
import { AnimatedBackgroundProps } from "../types";

const AnimatedBackground = ({
  mousePosition,
  darkMode,
}: AnimatedBackgroundProps) => {
  return (
    <>
      <div
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15), transparent 50%)`,
        }}
      />

      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 ${
              darkMode ? "bg-purple-400" : "bg-purple-600"
            } rounded-full animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default AnimatedBackground;
