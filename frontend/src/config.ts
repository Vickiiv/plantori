// Zentrale Stelle fuer den Projektnamen. Hier EINMAL aendern statt an
// mehreren Stellen im Code danach zu suchen. Wird u. a. in AuthLayout.tsx,
// Dashboard.tsx und Account.tsx verwendet.
//
// Zwei Stellen ausserhalb dieser Datei muessen trotzdem manuell angepasst
// werden, weil sie keine .ts-Datei importieren koennen:
//   - frontend/index.html            -> <title>App-Name</title>
//   - backend/src/utils/sendEmail.ts -> APP_NAME-Konstante fuer die Email-Texte
export const APP_NAME = 'Plantori';
