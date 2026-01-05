<script lang="ts">
    export let data;
    const { reportData, stats } = data;

    // Kalkulasi Occupancy Rate menggunakan LaTeX untuk dokumentasi:
    // $$\text{Occupancy Rate} = \frac{\text{stats.occupied}}{\text{stats.total}} \times 100$$
    const occupancyRate = ((stats.occupied / stats.total) * 100).toFixed(1);

    // SC4: Fungsi Export CSV (Data Migration/ETL Logic)
    function exportReport() {
        const headers = "Bed No,Ruangan,Departemen,Status,Nama Pasien,Tgl Masuk\n";
        const rows = reportData.map(r => 
            `${r.bedNo},${r.wardName},${r.deptName},${r.status},${r.patientName},${r.admissionDate}`
        ).join("\n");
        
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Laporan_BedTrack_Jan_2026.csv`;
        a.click();
    }
</script>

<div class="p-8 max-w-7xl mx-auto font-sans">
    <div class="flex justify-between items-end mb-10">
        <div>
            <h1 class="text-3xl font-black text-slate-800 tracking-tight">Analytics <span class="text-blue-600">& Reports</span></h1>
            <p class="text-slate-500 text-sm">Integrasi data ruang, bed, dan pasien secara real-time (Januari 2026).</p>
        </div>
        <button on:click={exportReport} class="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center gap-2">
            📥 DOWNLOAD CSV REPORT (SC4)
        </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kapasitas Total</span>
            <p class="text-4xl font-black text-slate-800 mt-2">{stats.total} Bed</p>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm border-l-4 border-l-blue-600">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tingkat Hunian (BOR)</span>
            <p class="text-4xl font-black text-blue-600 mt-2">{occupancyRate}%</p>
            <div class="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                <div class="bg-blue-600 h-full" style="width: {occupancyRate}%"></div>
            </div>
        </div>
        <div class="bg-slate-800 p-6 rounded-3xl text-white shadow-xl">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Klinis</span>
            <p class="text-4xl font-black mt-2">{stats.available} Kosong</p>
            <p class="text-xs text-slate-400 mt-2">Siap menerima pasien baru segera.</p>
        </div>
    </div>

    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table class="w-full text-left">
            <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th class="p-4 text-[10px] font-black uppercase text-slate-400">Bed</th>
                    <th class="p-4 text-[10px] font-black uppercase text-slate-400">Ruangan / Dept</th>
                    <th class="p-4 text-[10px] font-black uppercase text-slate-400">Status</th>
                    <th class="p-4 text-[10px] font-black uppercase text-slate-400">Nama Pasien</th>
                    <th class="p-4 text-[10px] font-black uppercase text-slate-400">Tgl Masuk</th>
                </tr>
            </thead>
            <tbody>
                {#each reportData as row}
                    <tr class="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td class="p-4 font-black text-slate-700">#{row.bedNo}</td>
                        <td class="p-4">
                            <p class="text-sm font-bold text-slate-800">{row.wardName}</p>
                            <p class="text-[10px] text-slate-400 font-bold uppercase">{row.deptName}</p>
                        </td>
                        <td class="p-4">
                            <span class="px-2 py-1 rounded-md text-[9px] font-black uppercase {row.status === 'Terisi' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}">
                                {row.status}
                            </span>
                        </td>
                        <td class="p-4 text-sm font-medium text-slate-600">{row.patientName}</td>
                        <td class="p-4 text-xs text-slate-400 italic">{row.admissionDate}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>