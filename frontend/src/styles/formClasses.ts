// Wiederverwendbare Tailwind-Klassen fuer Formulare. Keine eigene CSS-Datei -
// nur eine DRY-Buendelung der immer gleichen Utility-Kombination.
export const labelClass = 'mb-1.5 mt-4 block text-[13px] font-medium text-ink';

export const inputClass =
  'w-full rounded-[10px] border border-line px-3.5 py-2.5 text-[15px] text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20';

export const errorClass = 'mt-2.5 text-sm text-danger';

export const messageClass = 'mt-4 rounded-lg border border-line bg-canvas p-3 text-sm text-ink';

export const submitButtonClass =
  'mt-5 w-full rounded-[10px] bg-primary py-3 text-[15px] font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60';

export const switchTextClass = 'mt-5 text-center text-sm text-muted';

export const linkClass = 'font-medium text-primary';

export const cardPageClass = 'flex min-h-screen items-center justify-center bg-canvas p-6';

export const cardClass = 'w-full max-w-[380px] rounded-2xl border border-line bg-surface p-8';
