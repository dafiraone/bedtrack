// src/routes/admin/rooms/+page.server.ts
import { getWardManagementData, createWard, createBed, deleteWardWithLog, deleteBedWithLog } from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export const load = async () => {
    return await getWardManagementData();
};

export const actions = {
    addWard: async ({ request }) => {
        const data = await request.formData();
        try {
            await createWard(Number(data.get('wardNo')), data.get('wardName') as string, Number(data.get('deptId')));
            return { success: true };
        } catch (e) {
            return fail(400, { message: "Gagal tambah bangsal. No mungkin sudah ada." });
        }
    },
    addBed: async ({ request }) => {
        const data = await request.formData();
        await createBed(Number(data.get('bedNo')), Number(data.get('wardNo')));
        return { success: true };
    },
};