import { getAllUsers, createAdminUser, deleteAdminUser } from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export const load = async () => {
    return { users: await getAllUsers() };
};

export const actions = {
    create: async ({ request }) => {
        const data = await request.formData();
        const username = data.get('username') as string;
        const password = data.get('password') as string;
        const role = data.get('role') as string;

        if (!username || !password) return fail(400, { message: 'Data tidak lengkap' });

        try {
            await createAdminUser(username, password, role);
            return { success: true };
        } catch (e) {
            return fail(500, { message: 'Username sudah digunakan' });
        }
    },
    delete: async ({ request }) => {
        const data = await request.formData();
        const id = Number(data.get('id'));
        await deleteAdminUser(id);
        return { success: true };
    }
};