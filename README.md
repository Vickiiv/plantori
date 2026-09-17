# Auth-Starter

Wiederverwendbare Basis für Login/Registrierung (Backend + Frontend) – gedacht,
um sie bei jedem neuen Solo-Projekt zu kopieren und anzupassen, statt Auth
jedes Mal neu zu bauen.

## Struktur

```
auth-starter/
├── backend/     Express + TypeScript + MongoDB/Mongoose, JWT-Auth über httpOnly-Cookies
└── frontend/    React + TypeScript (Vite), Auth-Seiten als Platzhalter-Design
```

## Features

- Registrierung, Login, Logout, aktuellen Nutzer abrufen
- E-Mail-Verifizierung nach der Registrierung (über Resend)
- Passwort vergessen / zurücksetzen per E-Mail
- Eingeloggt Passwort ändern (invalidiert alte Sitzungen automatisch)
- E-Mail-Adresse ändern (mit Bestätigung der neuen Adresse)
- Konto löschen (Soft-Delete + Anonymisierung)
- Rate-Limiting auf Login/Registrierung/sensible Aktionen
- Account-Sperre nach 5 fehlgeschlagenen Login-Versuchen (15 Minuten)
- Input-Validierung mit Zod
- Zentrale Fehlerbehandlung (`AppError`) + 404-Handler
- `role`-Feld am User (aktuell ungenutzt, aber vorbereitet)
- Login/Registrierung als Split-Screen mit Tab-Umschalter (`frontend/src/components/AuthLayout.tsx`),
  Passwort-Sichtbarkeits-Toggle (`PasswordInput.tsx`) und Passwort-Wiederholung bei der Registrierung

## Setup

### Backend
1. `cd backend && npm install`
2. `.env.example` zu `.env` kopieren und Werte eintragen:
   - eigene `MONGO_URI`, neuen `JWT_SECRET`
   - `RESEND_API_KEY` von [resend.com](https://resend.com) (kostenloses Konto reicht für den Start,
     am besten ein eigenes Resend-Projekt pro App anlegen statt eins wiederzuverwenden)
   - `MAIL_FROM` auf eine mit Resend verifizierte Absenderadresse setzen
3. `npm run dev` – Server läuft auf `http://localhost:4000`

Ohne gültigen `RESEND_API_KEY` startet der Server trotzdem – nur der Email-Versand
schlägt fehl (wird geloggt, bricht aber Registrierung/Login nicht ab).

### Frontend
1. `cd frontend && npm install`
2. `npm run dev` – App läuft auf `http://localhost:5173`

Beide müssen gleichzeitig laufen.

## API-Endpunkte

| Methode | Pfad                        | Beschreibung                              | Geschützt |
|---------|------------------------------|---------------------------------------------|-----------|
| POST    | `/api/auth/register`         | Neuen Nutzer anlegen, Verifizierungs-Mail senden | Nein |
| POST    | `/api/auth/login`            | Einloggen                                    | Nein      |
| POST    | `/api/auth/logout`           | Cookie löschen                               | Nein      |
| GET     | `/api/auth/me`                | Aktuell eingeloggten Nutzer abrufen          | Ja        |
| GET     | `/api/auth/verify`            | E-Mail über Token bestätigen                 | Nein      |
| POST    | `/api/auth/resend-verification` | Verifizierungs-Mail erneut senden          | Ja        |
| POST    | `/api/auth/forgot-password`   | Passwort-Reset-Mail anfordern                | Nein      |
| POST    | `/api/auth/reset-password`    | Passwort mit Token zurücksetzen              | Nein      |
| PATCH   | `/api/auth/password`          | Eingeloggt Passwort ändern                   | Ja        |
| POST    | `/api/auth/change-email`      | Neue E-Mail anfragen (Bestätigung nötig)     | Ja        |
| DELETE  | `/api/auth/me`                | Konto löschen (Soft-Delete)                  | Ja        |

## Wie du das für ein neues Projekt wiederverwendest

1. Ganzen Ordner kopieren, in beiden `package.json`-Dateien den Namen anpassen
2. Projektweit nach `App-Name` suchen und durch den echten Projektnamen ersetzen
   (steckt in `index.html`, den Auth-Seiten und den Email-Templates in `sendEmail.ts`)
3. In `frontend/src/components/AuthLayout.tsx` die drei Konstanten `HEADLINE`, `DESCRIPTION`
   und `BULLETS` durch den echten Claim/Value-Pitch des Projekts ersetzen, sowie das Logo-Kürzel
4. Backend: neue `MONGO_URI`, neuen `JWT_SECRET` und ein neues Resend-Projekt samt
   `RESEND_API_KEY`/`MAIL_FROM` in `.env` eintragen (niemals Secrets wiederverwenden)
5. `backend/src/models/User.ts` um projektspezifische Felder erweitern (z. B. Profilbild)
6. Frontend: `frontend/src/styles/theme.css` an Farben/Typografie des neuen Projekts anpassen
   (Farbe der linken Seite hängt an `--color-primary`)
7. `frontend/src/pages/Dashboard.tsx` ist nur ein Platzhalter – hier fängt die eigentliche App an
8. Falls E-Mail-Verifizierung erzwungen werden soll: `ENFORCE_EMAIL_VERIFICATION=true` setzen
   und `requireVerified`-Middleware (`backend/src/middleware/requireVerified.ts`) vor die
   betroffenen Routen hängen

## Was hier bewusst NICHT enthalten ist

- Öffentliche Nutzernamen samt Änderungs-Cooldown – nur relevant, wenn Nutzernamen
  öffentlich sichtbar sind (z. B. Community-Plattform); bei einer privaten App ohne
  öffentliche Profile unnötige Komplexität
- Newsletter-Integration, Kontaktformular – kein Auth-Thema, projektspezifisch
- Rollenbasierte Berechtigungen (Admin-Routen o. ä.) – das `role`-Feld ist vorbereitet,
  die eigentliche Zugriffskontrolle kommt erst, wenn ein Projekt sie braucht

## Technische Entscheidungen (und warum)

- **JWT im httpOnly-Cookie statt `localStorage`** – für JavaScript im Browser nicht
  auslesbar; schützt den Token selbst bei einer XSS-Lücke im Frontend.
- **bcryptjs statt bcrypt** – reine JS-Implementierung ohne native Kompilierung,
  dadurch überall ohne Build-Tools installierbar.
- **`password`-Feld mit `select: false`** – der Hash wird nur bei expliziter Anfrage
  (`.select('+password')`) mitgeliefert, nie versehentlich über eine normale Query.
- **Zod-Validierung statt manueller if-Checks** – robuster, ein Schema pro Endpunkt
  statt verstreuter Prüfungen im Controller.
- **Ein gemeinsamer `sensitiveActionLimiter`** für Verifizierung/Passwort-vergessen/
  Email-ändern statt eigener Limiter pro Endpunkt – weniger Code, gleicher Schutz.
- **Account-Sperre nach 5 Fehlversuchen** ergänzt das Rate-Limiting: Rate-Limiting
  schützt vor Anfrage-Flut, die Sperre schützt das einzelne Konto gezielt.
- **`passwordChangedAt` + Token-Invalidierung** – ändert jemand sein Passwort
  (oder setzt es zurück), werden alte, bereits ausgestellte JWTs ungültig, selbst
  wenn sie noch nicht abgelaufen sind.
- **Soft-Delete statt echtem Löschen** – Konto wird anonymisiert statt aus der
  Datenbank entfernt; verhindert Datenverlust durch Unfälle und lässt sich mit
  abhängigen Daten (die pro Projekt unterschiedlich aussehen) sauber verknüpfen.
- **`ENFORCE_EMAIL_VERIFICATION`-Schalter** – während der Entwicklung oder solange
  Resend im Sandbox-Modus läuft, bleibt die Pflicht zur Verifizierung ausschaltbar,
  ohne den Code dafür zu ändern.
