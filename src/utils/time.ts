// src/utils/time.ts

export function formatTimeForChile(utcDateString: string): string {
  if (!utcDateString) return 'Fecha no disponible';

  // Añade la 'Z' (Zulu/UTC) al final del string para asegurarle a JavaScript
  // que el valor de la BD es UTC (solo si no termina en Z, para compatibilidad)
  const utcStringWithZ = utcDateString.endsWith('Z') ? utcDateString : utcDateString + 'Z';

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, 
    timeZone: 'America/Santiago' // ESTA ES LA CLAVE
  };
  
  // Convierte el string UTC a un objeto Date y lo formatea.
  return new Date(utcStringWithZ).toLocaleString('es-CL', options);
}