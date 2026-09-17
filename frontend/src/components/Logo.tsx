import { APP_NAME } from '../config';

interface LogoProps {
  className?: string;
}

// ---------------------------------------------------------------------
// ANPASSEN: Platzhalter-Logo als echtes Bild (kein reiner Text-Buchstabe
// mehr). Um ein eigenes Logo zu verwenden: die Datei
// frontend/public/logo-placeholder.svg durch die eigene Bilddatei ersetzen
// (gleicher Dateiname genuegt, dann muss hier nichts geaendert werden) -
// oder den Dateinamen unten im src-Pfad anpassen. PNG/JPG funktionieren
// genauso wie SVG.
// ---------------------------------------------------------------------
export function Logo({ className = 'h-9 w-9' }: LogoProps) {
  return (
    <img
      src="/logo-placeholder.svg"
      alt={`${APP_NAME} Logo`}
      className={`${className} rounded-lg object-cover`}
    />
  );
}
