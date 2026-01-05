// src/routes/rooms/+page.server.ts
import { getBedData } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    // Mengambil data dari database
    const allBeds = await getBedData();
    
    // 1. Anonimisasi data untuk Guest
    const sanitizedBeds = allBeds.map(bed => ({
        bed_No: bed.bed_No,
        ward_Name: bed.ward_Name,
        status: bed.status
    }));

    // 2. Pengelompokan
    const groupedBeds = sanitizedBeds.reduce((acc, bed) => {
        const group = bed.ward_Name;
        if (!acc[group]) acc[group] = [];
        acc[group].push(bed);
        return acc;
    }, {} as Record<string, typeof sanitizedBeds>);

    // 3. Hitung statistik sederhana
    const stats = {
        total: sanitizedBeds.length,
        available: sanitizedBeds.filter(b => b.status === 'available').length
    };

    // Kembalikan semua properti yang diminta oleh TypeScript
    return { 
        groupedBeds, 
        totalBeds: sanitizedBeds.length,
        beds: sanitizedBeds, // Properti yang sebelumnya dianggap hilang
        stats: stats        // Properti yang sebelumnya dianggap hilang
    };
};