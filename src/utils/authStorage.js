const USERS_KEY = 'event_manager_users';
const SESSION_KEY = 'event_manager_session';

function getUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const result = await crypto.subtle.digest('SHA-256', data);

  return Array.from(new Uint8Array(result))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export async function registerUser({ name, email, password }) {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }

  const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    salt,
    passwordHash: await hashPassword(password, salt),
  };

  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  return publicUser(user);
}

export async function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = getUsers().find((item) => item.email === normalizedEmail);

  if (!user || (await hashPassword(password, user.salt)) !== user.passwordHash) {
    throw new Error('Incorrect email or password.');
  }

  return publicUser(user);
}

export function readSession() {
  try {
    const user = JSON.parse(localStorage.getItem(SESSION_KEY));

    if (user?.id && user?.name && user?.email) {
      return user;
    }
  } catch {
    // An invalid saved session is treated as logged out.
  }

  return null;
}

export function saveSession(user) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}