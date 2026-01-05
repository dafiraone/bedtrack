<script lang="ts">
    import { invalidateAll } from '$app/navigation';
    import type { PageData } from './$types';

    export let data: PageData;

    let filterStatus = 'all'; 
    let loadingMap: Record<string, boolean> = {};

    // 1. DATA DASAR: Diambil dari database melalui getBedData
    $: beds = data.beds || [];

    // 2. STATISTIK GLOBAL
    $: stats = {
        total: beds.length,
        available: beds.filter(b => b.status === 'available').length,
        occupied: beds.filter(b => b.status === 'occupied').length,
        discharging: beds.filter(b => b.status === 'discharging').length
    };

    // 3. LOGIKA FILTER & SORTING
    $: filteredBeds = beds
        .filter(b => filterStatus === 'all' || b.status === filterStatus)
        .sort((a, b) => {
            const priority: Record<string, number> = { discharging: 1, occupied: 2, available: 3 };
            return priority[a.status] - priority[b.status];
        });

    // 4. PENGELOMPOKKAN BERDASARKAN RUANGAN
    $: groupedBeds = filteredBeds.reduce((acc, bed) => {
        const ward = bed.ward_Name;
        if (!acc[ward]) acc[ward] = [];
        acc[ward].push(bed);
        return acc;
    }, {} as Record<string, typeof filteredBeds>);

    async function handleDischarge(bed: any) {
        if (!confirm(`Proses pemulangan pasien ${bed.patient.name}?`)) return;
        loadingMap[bed.bed_No] = true;
        try {
            // Memanggil API untuk proses discharge/pemulangan
            const response = await fetch('/api/discharge', {
                method: 'POST',
                body: JSON.stringify({ bedId: bed.bed_No, patientId: bed.patient.id })
            });
            if ((await response.json()).success) invalidateAll();
        } catch (error) {
            alert("Gagal menghubungi server.");
        } finally {
            loadingMap[bed.bed_No] = false;
        }
    }
</script>

<div class="min-h-screen bg-slate-50 p-6 font-sans">
    
    <header class="mb-10 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
                <h1 class="text-3xl font-black text-slate-800 tracking-tight italic">
                    🏥 BedTrack <span class="text-blue-600">Admin</span>
                </h1>
                <p class="text-slate-500 mt-1 text-sm font-medium">Applied Health Informatics Command Center</p>
            </div>
            
            <nav class="flex flex-wrap items-center gap-2">
                <a href="/admin/staff" class="bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 px-4 py-2 rounded-xl font-bold text-xs transition-all border border-slate-200 flex items-center gap-2">
                    👥 Staff
                </a>
                <a href="/admin/reports" class="bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 px-4 py-2 rounded-xl font-bold text-xs transition-all border border-slate-200 flex items-center gap-2">
                    📊 Analytics Reports
                </a>
                <a href="/admin/rooms" class="bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 px-4 py-2 rounded-xl font-bold text-xs transition-all border border-slate-200 flex items-center gap-2">
                    🏨 Rooms
                </a>
                <a href="/admin/admissions" class="bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white px-4 py-2 rounded-xl font-bold text-xs transition-all border border-blue-100 flex items-center gap-2">
                    📥 Admission
                </a>
                <div class="w-px h-6 bg-slate-200 mx-1 hidden md:block"></div>
                <a href="/" class="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white px-5 py-2 rounded-xl font-bold text-xs transition-all border border-red-100">
                    Sign Out
                </a>
            </nav>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button on:click={() => filterStatus = 'all'} 
                class="flex flex-col p-4 rounded-xl border-2 transition-all {filterStatus === 'all' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100' : 'bg-slate-50 border-transparent'}">
                <span class="text-[10px] font-bold text-slate-400 uppercase">Total</span>
                <span class="text-2xl font-black">{stats.total}</span>
            </button>
            <button on:click={() => filterStatus = 'available'} 
                class="flex flex-col p-4 rounded-xl border-2 transition-all {filterStatus === 'available' ? 'border-green-500 bg-green-50 ring-2 ring-green-100' : 'bg-slate-50 border-transparent'}">
                <span class="text-[10px] font-bold text-green-600 uppercase">Tersedia</span>
                <span class="text-2xl font-black text-green-700">{stats.available}</span>
            </button>
            <button on:click={() => filterStatus = 'occupied'} 
                class="flex flex-col p-4 rounded-xl border-2 transition-all {filterStatus === 'occupied' ? 'border-red-500 bg-red-50 ring-2 ring-red-100' : 'bg-slate-50 border-transparent'}">
                <span class="text-[10px] font-bold text-red-600 uppercase">Terisi</span>
                <span class="text-2xl font-black text-red-700">{stats.occupied}</span>
            </button>
            <button on:click={() => filterStatus = 'discharging'} 
                class="flex flex-col p-4 rounded-xl border-2 transition-all {filterStatus === 'discharging' ? 'border-yellow-500 bg-yellow-50 ring-2 ring-yellow-100' : 'bg-slate-50 border-transparent'}">
                <span class="text-[10px] font-bold text-yellow-700 uppercase">Pulang</span>
                <span class="text-2xl font-black text-yellow-700">{stats.discharging}</span>
            </button>
        </div>
    </header>

    <div class="space-y-10">
        {#each Object.entries(groupedBeds) as [wardName, bedsInWard]}
            <section>
                <div class="flex items-center gap-4 mb-4">
                    <h2 class="text-sm font-black text-slate-700 bg-white px-3 py-1 rounded shadow-sm border border-slate-200 uppercase tracking-tighter">
                        🏢 {wardName}
                    </h2>
                    <div class="h-px flex-grow bg-slate-200"></div>
                    <span class="text-[10px] font-bold text-slate-400">{bedsInWard.length} Bed</span>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {#each bedsInWard as bed (bed.bed_No)}
                        {#if bed.patient}
                            <a href="/patient/{bed.patient.id}" class="group block no-underline">
                                <div class="p-4 rounded-2xl border-2 transition-all hover:shadow-lg hover:-translate-y-1 
                                    {bed.status === 'occupied' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}">
                                    <div class="flex justify-between items-start mb-2">
                                        <span class="font-black text-lg text-slate-700">#{bed.bed_No}</span>
                                    </div>
                                    <div class="text-sm">
                                        <p class="font-bold text-slate-800 truncate">{bed.patient.name}</p>
                                        <p class="text-[9px] text-slate-500 mt-1 italic">Masuk: {bed.patient.admissionDate}</p>
                                        {#if bed.status === 'discharging'}
                                            <button on:click|preventDefault|stopPropagation={() => handleDischarge(bed)} 
                                                class="mt-3 w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 text-[10px] py-1.5 rounded-lg font-bold transition-colors">
                                                {loadingMap[bed.bed_No] ? '...' : '🔔 PULANG'}
                                            </button>
                                        {:else}
                                            <div class="mt-3 flex gap-2">
                                                <a href="/admin/admissions/{bed.patient.admissionId}" 
                                                class="flex-1 text-center bg-slate-100 hover:bg-blue-600 hover:text-white text-blue-600 text-[9px] font-black py-1.5 rounded-lg transition-all shadow-sm">
                                                ✏️ EDIT DATA
                                                </a>
                                                <a href="/patient/{bed.patient.id}" 
                                                class="p-1.5 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors">
                                                👁️
                                                </a>
                                            </div>
                                        {/if}
                                    </div>
                                </div>
                            </a>
                        {:else}
                            <div class="p-4 rounded-2xl border-2 bg-white border-slate-100 opacity-60 hover:opacity-100 transition-opacity">
                                <div class="flex justify-between items-start mb-2">
                                    <span class="font-black text-lg text-slate-300">#{bed.bed_No}</span>
                                </div>
                                <div class="h-10 flex items-center justify-center">
                                    <span class="text-green-500 font-bold text-[10px]">✅ READY</span>
                                </div>
                            </div>
                        {/if}
                    {/each}
                </div>
            </section>
        {/each}
    </div>

    {#if Object.keys(groupedBeds).length === 0}
        <div class="mt-8 text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p class="text-slate-400 italic">Tidak ada bed dengan status "{filterStatus}"</p>
            <button on:click={() => filterStatus = 'all'} class="mt-2 text-blue-600 font-bold text-sm underline">Reset Filter</button>
        </div>
    {/if}
</div>