const STORAGE_KEY = 'event_manager_registrations';

export function readRegistrations() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      return saved;
    }
  } catch {
    // Start with no registrations if saved data cannot be read.
  }

  return {};
}

export function saveRegistrations(byUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(byUser));
}