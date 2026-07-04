export function timeAgo(dateParam: string | Date): string {
  const date = typeof dateParam === 'string' ? new Date(dateParam) : dateParam;
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days < 30) return `${days} days ago`;
  
  return date.toLocaleDateString();
}
