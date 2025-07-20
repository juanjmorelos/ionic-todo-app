export function getFormattedDate(dateStr: string): string {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  let parts = date
    .toLocaleString('es-CO', options)
    .replace(',', '')
    .replace('.', '')
    .split(' ');

  parts[0] = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);

  return `${parts[0]} ${parts[1]} ${parts[2]} de ${parts[3]} ${parts[4]} ${parts[5]}`;
}
