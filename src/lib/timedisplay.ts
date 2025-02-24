export function toTimeSince(date: Date): string {
  const numeric = Date.now() - date.getTime();

  if (numeric < 3600000)
    return 'Just now'; // Less than an hour
  if (numeric < 1000 * 60 * 60 * 24)
    return `${Math.floor(numeric / 3600000)} hours ago`; // Less than a day 
  if (numeric < 1000 * 60 * 60 * 24 * 7)
    return `${Math.floor(numeric / (1000 * 60 * 60 * 24))} days ago`; // Less than a week
  if (numeric < 1000 * 60 * 60 * 24 * 30)
    return `${Math.floor(numeric / (1000 * 60 * 60 * 24 * 7))} weeks ago` // Less than a month
  if (numeric < 1000 * 60 * 60 * 24 * 365)
    return `${Math.floor(numeric / (1000 * 60 * 60 * 24 * 30))} months ago` // Less than a year
  else return `${Math.floor(numeric / (1000 * 60 * 60 * 24 * 365))} years ago` // Years
}

export function toTime(score: number, milliseconds?: boolean): string {
  return `${score > 3600000 ? Math.floor(score / 3600000) + ':' : ''}${(Math.floor(score / 60000) % 60).toString().padStart(2, '0')}:${(Math.floor(score / 1000) % 60).toString().padStart(2, '0')}` + (milliseconds ? '.' + score % 1000 : '');
}