import { useState, useEffect } from "react";

export default function Accesibilidad() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [highContrast]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botón principal */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="
          px-4 py-2 rounded shadow font-semibold

          bg-blue-600 text-white
          hover:bg-blue-700

          dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-white
        "
      >
        Accesibilidad
      </button>

      {/* Menú */}
      {menuOpen && (
        <div
          className="
            mt-2 p-4 w-64 rounded shadow-lg border
            
            bg-white text-gray-900 border-gray-300    /* Modo claro */
            dark:bg-neutral-900 dark:text-gray-100 dark:border-neutral-700   /* Modo oscuro */
          "
        >
          <h3 className="font-semibold mb-2">Tamaño de texto</h3>

          <div className="flex gap-3 mb-4">
            {/* BOTÓN A- */}
            <button
              onClick={() => setFontSize(f => Math.max(f - 2, 12))}
              className="
                px-3 py-1 border rounded
                
                bg-gray-100 text-gray-800 border-gray-300
                hover:bg-gray-200

                dark:bg-neutral-800 dark:text-gray-100 dark:border-neutral-600
                dark:hover:bg-neutral-700
              "
            >
              A-
            </button>

            {/* BOTÓN A+ */}
            <button
              onClick={() => setFontSize(f => f + 2)}
              className="
                px-3 py-1 border rounded

                bg-gray-100 text-gray-800 border-gray-300
                hover:bg-gray-200

                dark:bg-neutral-800 dark:text-gray-100 dark:border-neutral-600
                dark:hover:bg-neutral-700
              "
            >
              A+
            </button>
          </div>

          <h3 className="font-semibold mb-2">Otras opciones</h3>

          {/* BOTÓN ALTO CONTRASTE */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            className="
              w-full px-3 py-2 border rounded mb-3

              bg-gray-100 text-gray-900 border-gray-300
              hover:bg-gray-200

              dark:bg-neutral-800 dark:text-gray-100 dark:border-neutral-600
              dark:hover:bg-neutral-700
            "
          >
            Alto contraste
          </button>

          {/* BOTÓN RESTABLECER */}
          <button
            onClick={() => {
              setFontSize(16);
              setHighContrast(false);
            }}
            className="
              w-full px-3 py-2 border rounded

              bg-gray-100 text-gray-900 border-gray-300
              hover:bg-gray-200

              dark:bg-neutral-800 dark:text-gray-100 dark:border-neutral-600
              dark:hover:bg-neutral-700
            "
          >
            Restablecer
          </button>
        </div>
      )}
    </div>
  );
}
