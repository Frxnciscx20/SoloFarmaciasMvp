import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Accesibilidad from "../components/Accesibilidad";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Render de todas las páginas */}
      <Component {...pageProps} />

      {/* Botón flotante de accesibilidad */}
      <Accesibilidad />
    </>
  );
}
