// src/routes/admin/admissions/[id]/+page.server.ts
import { getAdmissionById, updateAdmission, getAdmissionFormData } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ params }) => {
    const admission = await getAdmissionById(Number(params.id));
    if (!admission) throw error(404, 'Data admisi tidak ditemukan');

    const formData = await getAdmissionFormData();
    return { admission, ...formData };
};

export const actions = {
    default: async ({ request, params }) => {
        const data = await request.formData();
        await updateAdmission(Number(params.id), {
            bedNo: Number(data.get('bedNo')),
            nurseId: Number(data.get('nurseId')),
            amount: Number(data.get('amount')),
            estDischarge: data.get('estDischarge'),
            paymentMode: data.get('paymentMode')
        });

        throw redirect(303, '/admin');
    }
};