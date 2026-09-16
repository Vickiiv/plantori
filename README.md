# Auth-Starter

Wiederverwendbare Basis für Login/Registrierung (Backend + Frontend) – gedacht,
um sie bei jedem neuen Solo-Projekt zu kopieren und anzupassen, statt Auth
jedes Mal neu zu bauen.

## Struktur

```
auth-starter/
├── backend/     Express + TypeScript + MongoDB/Mongoose, JWT-Auth über httpOnly-Cookies
└── frontend/    React + TypeScript (Vite), Login/Registrierung/Dashboard als Platzhalter-Design
```

## Setup

### Backend
1. `cd backend && npm install`
2. `.env.example` zu `.env` kopieren und Werte eintragen (eigene `MONGO_URI`, neuen `JWT_SECRET`)
3. `npm run dev` – Server läuft auf `http://localhost:4000`

### Frontend
1. `cd frontend && npm install`
2. `npm run dev` – App läuft auf `http://localhost:5173`

Beide müssen gleichzeitig laufen, damit Login/Registrierung funktioniert.

## API-Endpunkte

| Methode | Pfad               | Beschreibung                          | Geschützt |
|---------|---------------------|----------------------------------------|-----------|
| POST    | `/api/auth/register` | Neuen Nutzer anlegen, direkt einloggen | Nein      |
| POST    | `/api/auth/login`    | Einloggen                              | Nein      |
| POST    | `/api/auth/logout`   | Cookie löschen                         | Nein      |
| GET     | `/api/auth/me`       | Aktuell eingeloggten Nutzer abrufen    | Ja        |

## Wie du das für ein neues Projekt wiederverwendest

1. Ganzen Ordner kopieren, in beiden `package.json`-Dateien den Namen anpassen
2. Projektweit nach `App-Name` suchen und durch den echten Projektnamen ersetzen
   (steckt in `index.html`, `Login.tsx`, `Register.tsx`, `Dashboard.tsx`)
3. Backend: neue `MONGO_URI` und neuen `JWT_SECRET` in `.env` eintragen (niemals den Secret wiederverwenden)
4. `backend/src/models/User.ts` um projektspezifische Felder erweitern (z. B. Profilbild, Einstellungen)
5. Frontend: `frontend/src/styles/theme.css` an Farben/Typografie des neuen Projekts anpassen
6. `frontend/src/pages/Dashboard.tsx` ist nur ein Platzhalter – hier fängt die eigentliche App an

## Was hier bewusst NICHT enthalten ist

- Passwort-Reset per E-Mail (erst ergänzen, wenn ein Projekt es wirklich braucht)
- Rollen/Berechtigungen (aktuell ist jeder registrierte Nutzer gleichberechtigt)
- E-Mail-Verifizierung

Das hält den Starter schlank – diese Dinge lassen sich bei Bedarf pro Projekt ergänzen,
ohne die Grundstruktur zu verkomplizieren.

## Technische Entscheidungen (und warum)

- **JWT im httpOnly-Cookie statt `localStorage`** – ein Cookie mit `httpOnly` ist für
  JavaScript im Browser nicht auslesbar. Selbst bei einer XSS-Lücke im Frontend kann
  der Token dadurch nicht gestohlen werden.
- **bcryptjs für Passwort-Hashing** – bewährter Standard statt Eigenbau.
- **CORS mit `credentials: true`** – notwendig, damit das Cookie zwischen Frontend
  (Port 5173) und Backend (Port 4000) überhaupt übertragen wird.
- **Ein Model (`User`) statt Rollen-System** – für Solo-Projekte mit einer Nutzergruppe
  reicht das; Rollen wären unnötige Komplexität ohne aktuellen Bedarf.
