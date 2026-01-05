import { getFullReportData } from '$lib/server/db';

export const load = async () => {
    const reportData = await getFullReportData();
    
    // Perbaikan: Hitung semua bed yang "Tidak Tersedia" (Terisi, Pulang, atau Overdue)
    const occupiedCount = reportData.filter(r => r.status !== 'Tersedia').length;

    const stats = {
        total: reportData.length,
        occupied: occupiedCount, 
        available: reportData.length - occupiedCount
    };

    return { reportData, stats };
};