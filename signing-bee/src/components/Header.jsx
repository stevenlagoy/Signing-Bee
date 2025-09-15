import React from "react";

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-yellow-100 p-4 shadow-md rounded-2xl">
      {/* Logo area */}
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow">
          {/* Replace with logo image */}
          <span className="text-2xl font-bold text-white">🐝</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Signing Bee</h1>
      </div>
    </header>
  );
}
