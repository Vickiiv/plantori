import { Resend } from 'resend';
import { env } from '../config/env';

const resend = new Resend(env.RESEND_API_KEY);
const APP_NAME = 'App-Name';

function wrapEmailHtml(heading: string, bodyHtml: string): string {
  return `
  <!DOCTYPE html>
  <html lang="de">
    <head><meta charset="utf-8" /></head>
    <body style="margin:0;padding:0;background-color:#faf8f4;font-family:Arial,Helvetica,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf8f4;padding:32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e1d8;">
              <tr>
                <td style="padding:36px 32px 12px;text-align:center;">
                  <span style="font-weight:600;font-size:18px;color:#5b4fc4;">${APP_NAME}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 32px 32px;text-align:center;">
                  <h1 style="margin:0 0 16px;font-size:22px;font-weight:500;color:#2e2b26;">${heading}</h1>
                  ${bodyHtml}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

async function sendEmail(to: string, subject: string, html: string) {
  const { error } = await resend.emails.send({ from: env.MAIL_FROM, to, subject, html });
  if (error) {
    throw new Error(`Email-Versand fehlgeschlagen: ${error.message}`);
  }
}

export async function sendVerificationEmail(to: string, rawToken: string) {
  const verifyUrl = `${env.CLIENT_URL}/verify?token=${rawToken}`;
  const html = wrapEmailHtml(
    'Bestätige deine E-Mail-Adresse',
    `<p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#6b6860;">Schön, dass du dabei bist. Bestätige deine E-Mail-Adresse, um dein Konto zu aktivieren.</p>
     <a href="${verifyUrl}" style="display:inline-block;background-color:#7c6fd1;color:#fff;text-decoration:none;font-weight:500;font-size:14px;padding:12px 28px;border-radius:999px;">E-Mail bestätigen</a>
     <p style="margin:24px 0 0;font-size:12px;color:#6b6860;">Der Link ist 24 Stunden gültig.</p>`,
  );
  return sendEmail(to, `Bestätige deine ${APP_NAME}-Registrierung`, html);
}

export async function sendPasswordResetEmail(to: string, rawToken: string) {
  const resetUrl = `${env.CLIENT_URL}/reset-password?token=${rawToken}`;
  const html = wrapEmailHtml(
    'Passwort zurücksetzen',
    `<p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#6b6860;">Du hast angefragt, dein Passwort zurückzusetzen. Klicke auf den Button, um ein neues zu vergeben.</p>
     <a href="${resetUrl}" style="display:inline-block;background-color:#7c6fd1;color:#fff;text-decoration:none;font-weight:500;font-size:14px;padding:12px 28px;border-radius:999px;">Neues Passwort vergeben</a>
     <p style="margin:24px 0 0;font-size:12px;color:#6b6860;">Der Link ist 1 Stunde gültig. Falls du das nicht warst, ignoriere diese E-Mail.</p>`,
  );
  return sendEmail(to, `Passwort zurücksetzen bei ${APP_NAME}`, html);
}

export async function sendEmailChangeVerification(to: string, rawToken: string) {
  const verifyUrl = `${env.CLIENT_URL}/verify?token=${rawToken}`;
  const html = wrapEmailHtml(
    'Neue E-Mail-Adresse bestätigen',
    `<p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#6b6860;">Bestätige deine neue E-Mail-Adresse, um den Wechsel abzuschließen.</p>
     <a href="${verifyUrl}" style="display:inline-block;background-color:#7c6fd1;color:#fff;text-decoration:none;font-weight:500;font-size:14px;padding:12px 28px;border-radius:999px;">E-Mail bestätigen</a>
     <p style="margin:24px 0 0;font-size:12px;color:#6b6860;">Der Link ist 24 Stunden gültig.</p>`,
  );
  return sendEmail(to, `Bestätige deine neue E-Mail-Adresse bei ${APP_NAME}`, html);
}
