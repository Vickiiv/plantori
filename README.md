# Auth-Starter

Wiederverwendbare Basis für Login/Registrierung (Backend + Frontend) – gedacht,
um sie bei jedem neuen Solo-Projekt zu kopieren und anzupassen, statt Auth
jedes Mal neu zu bauen.

## Auf einen Blick

- **Backend:** Express + TypeScript + MongoDB/Mongoose. Kompletter Auth-Flow
  (Registrierung, Login, E-Mail-Verifizierung, Passwort-Reset, Passwort/Email
  ändern, Konto löschen) inklusive Rate-Limiting, Account-Sperre und
  Zod-Validierung – siehe [Backend-Features](#backend-features).
- **Frontend:** React + TypeScript (Vite) + Tailwind CSS v4. Login/Registrierung
  als Split-Screen mit Tab-Umschalter, passende Seiten für alle Backend-Flows,
  responsive (Mobile/Tablet/Desktop) – siehe [Frontend-Features](#frontend-features).
- **Zum Anpassen:** jede Stelle, an der du für ein neues Projekt etwas ändern
  musst, ist im Code mit `// ANPASSEN:` markiert – Übersicht dazu weiter unten
  unter [Wo du was anpassen kannst](#wo-du-was-anpassen-kannst).

## Struktur

```
auth-starter/
├── backend/     Express + TypeScript + MongoDB/Mongoose, JWT-Auth über httpOnly-Cookies
└── frontend/    React + TypeScript (Vite) + Tailwind CSS v4
```

## Backend-Features

- Registrierung, Login, Logout, aktuellen Nutzer abrufen
- E-Mail-Verifizierung nach der Registrierung (über Resend)
- Passwort vergessen / zurücksetzen per E-Mail
- Eingeloggt Passwort ändern (invalidiert alte Sitzungen automatisch)
- E-Mail-Adresse ändern (mit Bestätigung der neuen Adresse)
- Konto löschen (Soft-Delete + Anonymisierung)
- Name ändern (eigener Endpunkt, unabhängig von der E-Mail-Änderung)
- Rate-Limiting auf Login/Registrierung/sensible Aktionen
- Account-Sperre nach 5 fehlgeschlagenen Login-Versuchen (15 Minuten)
- Input-Validierung mit Zod
- Zentrale Fehlerbehandlung (`AppError`) + 404-Handler
- `role`-Feld am User (aktuell ungenutzt, aber vorbereitet)

## Frontend-Features

- Login/Registrierung als Split-Screen mit Tab-Umschalter (`AuthLayout.tsx`) –
  auf Mobile/Tablet (unter 1024px) verschwindet die linke Info-Seite komplett,
  nur das Formular bleibt sichtbar und wird dort bewusst etwas größer dargestellt
- Passwort-Sichtbarkeits-Toggle (Augen-Icon) bei jedem Passwortfeld
- Passwort-Wiederholung bei Registrierung und beim Passwort-Ändern (mit Abgleich-Prüfung)
- Passendes Frontend zu jedem Backend-Flow: Passwort vergessen, Passwort zurücksetzen,
  E-Mail-Verifizierung, Konto-Seite (Passwort ändern, Konto löschen)
- Logo (Icon + Name) in Dashboard/Konto ist klickbar und führt immer zurück zum Dashboard
- Alle Buttons zeigen automatisch einen Pointer-Cursor (globale Regel in `theme.css`)
- Austauschbares Platzhalter-Logo als echte Bilddatei (`Logo.tsx` + `public/logo-placeholder.svg`)

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
| PATCH   | `/api/auth/profile`           | Name ändern                                  | Ja        |
| POST    | `/api/auth/change-email`      | Neue E-Mail anfragen (Bestätigung nötig)     | Ja        |
| DELETE  | `/api/auth/me`                | Konto löschen (Soft-Delete)                  | Ja        |

## Wo du was anpassen kannst

Jede Zeile unten ist im Code zusätzlich mit `// ANPASSEN:` markiert – im
Editor danach suchen, um alle Stellen auf einen Blick zu sehen.

| Was | Datei |
|---|---|
| Projektname (zentral) | `frontend/src/config.ts` (`APP_NAME`) |
| Projektname (zwei Stellen, die `config.ts` nicht importieren können) | `frontend/index.html`, `backend/src/utils/sendEmail.ts` |
| Logo-Bild | `frontend/public/logo-placeholder.svg` ersetzen (gleicher Dateiname reicht) |
| Farben | `frontend/src/styles/theme.css` (`@theme`-Block, jede Farbe einzeln kommentiert) |
| Schriftart | `frontend/index.html` (Google-Fonts-Link) + `theme.css` (`--font-sans`) |
| Claim, Beschreibung, Bullet-Punkte (linke Seite) | `frontend/src/components/AuthLayout.tsx` |
| Titel/Untertitel Login, Register | `frontend/src/pages/Login.tsx`, `Register.tsx` |
| Texte auf den restlichen Auth-Seiten | `ForgotPassword.tsx`, `ResetPassword.tsx`, `VerifyEmail.tsx`, `Account.tsx` |
| Wo die eigentliche App anfängt | `frontend/src/pages/Dashboard.tsx` |
| Neue App-Routen | `frontend/src/App.tsx` |
| Formular-Styling (Größen/Abstände) | `frontend/src/styles/formClasses.ts` |
| Backend-URL für Produktion | `frontend/src/api/authApi.ts` (`VITE_API_URL`) |
| Eigene Felder am User | `backend/src/models/User.ts` |
| Alle Umgebungsvariablen erklärt | `backend/.env.example` |

## Wie du das für ein neues Projekt wiederverwendest

1. Ganzen Ordner kopieren, in beiden `package.json`-Dateien den Namen anpassen
2. Die Tabelle oben durchgehen (oder im Editor nach `// ANPASSEN:` suchen) und
   Projektname, Logo, Farben und Texte ersetzen
3. Backend: neue `MONGO_URI`, neuen `JWT_SECRET` und ein neues Resend-Projekt samt
   `RESEND_API_KEY`/`MAIL_FROM` in `.env` eintragen (niemals Secrets wiederverwenden)
4. Falls E-Mail-Verifizierung erzwungen werden soll: `ENFORCE_EMAIL_VERIFICATION=true` setzen
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
- **Platzhalter-Logo als Bilddatei statt Text-Buchstabe** – so lässt sich ein
  echtes Logo einfach durch Austauschen einer Datei einsetzen, ohne Komponenten
  anzufassen.
