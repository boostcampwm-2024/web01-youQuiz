export function formatElapsedTime(elapsedTime: number) {
  const rtf = new Intl.RelativeTimeFormat('ko', { numeric: 'auto' });

  if (elapsedTime >= 3600) {
    const hours = Math.floor(elapsedTime / 3600);
    return rtf.format(-hours, 'hour');
  } else if (elapsedTime >= 60) {
    const minutes = Math.floor(elapsedTime / 60);
    return rtf.format(-minutes, 'minute');
  } else {
    return rtf.format(-elapsedTime, 'second');
  }
}
