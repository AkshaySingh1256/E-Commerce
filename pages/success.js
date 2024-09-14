import React from "react";
import Link from "next/link"; // Import Link from Next.js to navigate to the home page.

export default function Success() {
  return (
    <div className="flex flex-col justify-center bg-slate-700 items-center h-screen">
      <div style={{ textAlign: "center" }}>
        {/* Your SVG code remains the same */}
        <div className="animate-bounce">
        <svg
        
          width="100"
          height="100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="40" stroke="lightgreen" strokeWidth="4" fill="transparent" />
          <path
            d="M30 50 L45 65 L75 35"
            stroke="lightgreen"
            strokeWidth="5"
            fill="transparent"
          />
        </svg>
        </div>
      </div>

      <p className="text-green-600 text-lg font-semibold mt-4">Payment is successful</p>

      <Link href="/">
        <a className="text-blue-500 text-sm mt-4 hover:underline">Go to Home</a>
      </Link>
    </div>
  );
}
