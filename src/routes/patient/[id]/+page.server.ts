// src/routes/patient/[id]/+page.server.ts
import { getBedData } from '$lib/server/db';

export const load = async ({ params }) => {
    const patientId = params.id;
    const allBeds = await getBedData();
    const myBed = allBeds.find(b => b.patient && b.patient.id === patientId);

    return { 
        found: !!myBed, 
        bed: myBed,
        patientId 
    };
};