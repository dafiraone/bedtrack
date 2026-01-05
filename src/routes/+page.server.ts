// src/routes/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import { authenticateUser, verifyPatient } from '$lib/server/db';

export const actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();
        const role = formData.get('role') as string; // 'admin' atau 'patient'

        // --- 1. LOGIKA LOGIN ADMIN ---
        if (role === 'admin') {
            const username = formData.get('username') as string;
            const password = formData.get('password') as string;

            const user = await authenticateUser(username, password);

            if (user && user.role === 'admin') {
                // Simpan session admin di cookie
                cookies.set('auth_token', JSON.stringify(user), {
                    path: '/',
                    httpOnly: true,
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24 // 1 hari
                });

                throw redirect(303, '/admin');
            } else {
                return fail(400, { 
                    error: 'Username atau Password salah!', 
                    role: 'admin' 
                });
            }
        }

        // --- 2. LOGIKA LOGIN PASIEN ---
        if (role === 'patient') {
            const patientId = formData.get('patientId') as string;

            // Verifikasi ID Pasien di database MariaDB
            const patient = await verifyPatient(patientId);

            if (patient) {
                // Redirect ke halaman Companion App pasien tersebut
                throw redirect(303, `/patient/${patientId}`);
            } else {
                return fail(400, { 
                    error: 'ID Pasien tidak ditemukan atau tidak sedang dirawat.', 
                    role: 'patient',
                    patientId 
                });
            }
        }
    }
};