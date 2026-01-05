import { admitPatient, getAdmissionFormData } from '$lib/server/db';
import { fail } from '@sveltejs/kit';

export const load = async () => {
    return await getAdmissionFormData();
};

export const actions = {
    admit: async ({ request }) => {
        const data = await request.formData();
        try {
            await admitPatient({
                patientId: Number(data.get('patientId')),
                bedNo: Number(data.get('bedNo')),
                nurseId: Number(data.get('nurseId')),
                amount: Number(data.get('deposit')),
                estDischarge: data.get('estDischarge') as string // Ambil dari form
            });
            return { success: true };
        } catch (e: any) {
            return fail(400, { message: e.message });
        }
    }
};