export function isEventCompleted(event) {
  const dateTime = event.dateTime || event.dates?.start?.dateTime;
  const localDate = event.localDate || event.dates?.start?.localDate;

  if (dateTime) {
    return new Date(dateTime).getTime() < Date.now();
  }

  if (localDate) {
    return localDate < new Date().toISOString().slice(0, 10);
  }

  return false;
}