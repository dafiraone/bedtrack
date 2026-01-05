// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

interface UserSession {
  id: number;
  username: string;
  role: string;
}

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('auth_token');
  if (token) {
    try {
      const session: UserSession = JSON.parse(token);
      event.locals.user = session;
    } catch {
      event.cookies.delete('auth_token', { path: '/' });
    }
  }

  return resolve(event);
};
