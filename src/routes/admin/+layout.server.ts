// src/routes/admin/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, parent }) => {
  const token = cookies.get('auth_token');
  if (!token) {
    throw redirect(303, '/');
  }

  try {
    const session = JSON.parse(token);
    if (session.role !== 'admin') {
      throw redirect(303, '/');
    }
    return { user: session };
  } catch {
    cookies.delete('auth_token', { path: '/' });
    throw redirect(303, '/');
  }
};
