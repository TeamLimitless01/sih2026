"use client";

import { Printer } from "lucide-react";
import { useEffect } from "react";

export function PrintButton() {
  // Automatically pop the print dialog when the page loads
  useEffect(() => {
    // Wait a brief moment to ensure fonts/styles are loaded
    const t = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <button 
      onClick={() => window.print()} 
      className="print:hidden absolute top-8 right-8 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded flex items-center gap-2 shadow"
    >
      <Printer className="w-4 h-4" />
      Save as PDF
    </button>
  );
}
