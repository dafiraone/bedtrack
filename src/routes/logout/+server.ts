// src/routes/logout/+server.ts  ← +SERVER.ts bukan +page.server.ts
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
  cookies.delete('auth_token', { 
    path: '/' 
  });
  throw redirect(303, '/');
};
