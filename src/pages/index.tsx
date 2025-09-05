import { useState, useEffect } from 'react'

export default function Header() {
  return (
    <header className="bg-red-600 text-white py-4 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span>💊</span> <span>Solo Farmacias Version 1</span>
        </h1>
        <nav className="flex items-center gap-3 text-sm">
          <a
            href="/login"
            className="bg-white text-red-600 px-4 py-1 rounded hover:bg-red-50 transition"
          >
            Iniciar sesión
          </a>
          <a
            href="/registro"
            className="border border-white/80 px-4 py-1 rounded hover:bg-white hover:text-red-600 transition"
          >
            Registrarse
          </a>
        </nav>
      </div>
    </header>
  );
}
