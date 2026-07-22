// Authorized Google account emails. Anyone signed in whose email is not in
// this list sees the "not authorized" screen instead of the app.
// Keep this in sync with the list in firestore.rules.
export const WHITELISTED_EMAILS: string[] = [
  'amirulxhakimi@gmail.com',
  'lyn.kecik@gmail.com',
  'aidils4fw4n@gmail.com',
];

export function isWhitelisted(email: string | undefined | null): boolean {
  if (!email) return false;
  return WHITELISTED_EMAILS.includes(email.toLowerCase());
}
