"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function Slogan() {
  const [isEnglish, setIsEnglish] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsEnglish((prev) => !prev);
    }, 4000); // Swap every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex justify-center items-center h-[120px] md:h-[160px] lg:h-[180px] mb-8 w-full max-w-5xl mx-auto">
      <h1
        className={cn(
          "absolute w-full text-center text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] transition-all duration-1000 ease-in-out text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400",
          isEnglish ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6 pointer-events-none"
        )}
      >
        The Digital Eye for a<br />
        Digital India.
      </h1>
      <h1
        className={cn(
          "absolute w-full text-center text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.2] transition-all duration-1000 ease-in-out text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-rose-400",
          !isEnglish ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
        )}
      >
        डिजिटल भारत के लिए<br />
        डिजिटल दृष्टि।
      </h1>
    </div>
  );
}
