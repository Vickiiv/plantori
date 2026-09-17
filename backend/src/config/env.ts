import dotenv from 'dotenv';
dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Umgebungsvariable ${name} fehlt in der .env Datei`);
  }
  return value;
}

export const env = {
  PORT: process.env.PORT || '4000',
  MONGO_URI: required('MONGO_URI'),
  JWT_SECRET: required('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  NODE_ENV: process.env.NODE_ENV || 'development',
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  // Fallback, falls MAIL_FROM in der .env fehlt. ANPASSEN: eigenen Projektnamen
  // eintragen, sobald eine echte Resend-Absenderadresse existiert.
  MAIL_FROM: process.env.MAIL_FROM || 'App-Name <onboarding@resend.dev>',
  ENFORCE_EMAIL_VERIFICATION: process.env.ENFORCE_EMAIL_VERIFICATION === 'true',
};
