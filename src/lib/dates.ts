export function formatDateDMY(iso: string): string {
  if (!iso) return '';
  const [year, month, day] = iso.split('-');
  return `${day}-${month}-${year}`;
}
