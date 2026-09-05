export function formatDateDMY(iso: string): string {
  const [year, month, day] = iso.split('-');
  return `${day}-${month}-${year}`;
}
