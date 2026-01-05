<script lang="ts">
    import type { PageData } from './$types';
    export let data: PageData;

    $: groupedBeds = data.groupedBeds || {};
    
    // Hitung statistik ketersediaan secara global
    $: allBedsFlat = Object.values(groupedBeds).flat();
    $: availableCount = allBedsFlat.filter(b => b.status === 'available').length;
    $: occupancyPercent = (((allBedsFlat.length - availableCount) / allBedsFlat.length) * 100).toFixed(1);
</script>

<div class="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
    <div class="max-w-6xl mx-auto">
        
        <header class="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 class="text-3xl font-black tracking-tight">🏥 Status Kapasitas <span class="text-blue-600">Bed</span></h1>
                <p class="text-slate-500 text-sm mt-1 font-medium">Informasi ketersediaan ruangan real-time untuk pengunjung.</p>
            </div>
            <a href="/" class="text-xs font-bold bg-white border border-slate-200 px-4 py-2 rounded-full hover:bg-slate-50 transition-colors shadow-sm">
                ← Kembali ke Login
            </a>
        </header>

        <div class="bg-blue-600 rounded-[2rem] p-8 text-white mb-12 shadow-2xl shadow-blue-200 flex flex-col md:flex-row justify-between items-center gap-8 border-4 border-white">
            <div class="text-center md:text-left">
                <span class="text-blue-200 uppercase font-black tracking-[0.2em] text-[10px]">Live Dashboard</span>
                <h2 class="text-5xl font-black mt-2">{availableCount} <span class="text-2xl font-medium opacity-80 text-white">Bed Kosong</span></h2>
                <p class="text-blue-100 mt-2 font-medium">Tersedia dari total kapasitas {data.totalBeds} tempat tidur.</p>
            </div>
            
            <div class="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 text-center min-w-[160px]">
                <span class="block text-4xl font-black">{occupancyPercent}%</span>
                <span class="text-[10px] font-bold uppercase tracking-widest opacity-70">Tingkat Hunian</span>
                <div class="w-full bg-blue-900/30 rounded-full h-1.5 mt-4 overflow-hidden">
                    <div class="bg-green-400 h-full" style="width: {occupancyPercent}%"></div>
                </div>
            </div>
        </div>

        <div class="space-y-12">
            {#each Object.entries(groupedBeds) as [wardName, beds]}
                <section>
                    <div class="flex items-center gap-4 mb-6">
                        <div class="bg-blue-600 w-2 h-8 rounded-full"></div>
                        <h3 class="text-xl font-black text-slate-800 uppercase tracking-tight">{wardName}</h3>
                        <div class="h-px flex-grow bg-slate-200"></div>
                        <span class="text-[10px] font-bold text-slate-400 bg-white border px-3 py-1 rounded-full">
                            {beds.filter(b => b.status === 'available').length} TERSEDIA
                        </span>
                    </div>

                    <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        {#each beds as bed}
                            <div class="group relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center
                                {bed.status === 'available' 
                                    ? 'bg-white border-green-100 shadow-sm hover:border-green-400' 
                                    : 'bg-slate-100 border-transparent opacity-40'}">
                                
                                <span class="text-[10px] font-black text-slate-400 mb-2">#{bed.bed_No}</span>
                                
                                <div class="w-8 h-8 rounded-full flex items-center justify-center mb-1
                                    {bed.status === 'available' ? 'bg-green-50' : 'bg-slate-200'}">
                                    {#if bed.status === 'available'}
                                        <span class="text-green-500 text-sm">🛏️</span>
                                    {:else}
                                        <span class="text-slate-400 text-sm">🔒</span>
                                    {/if}
                                </div>
                                
                                <span class="text-[9px] font-black uppercase tracking-tighter
                                    {bed.status === 'available' ? 'text-green-600' : 'text-slate-400'}">
                                    {bed.status === 'available' ? 'Ready' : 'Full'}
                                </span>
                            </div>
                        {/each}
                    </div>
                </section>
            {/each}
        </div>

        <footer class="mt-20 py-8 border-t border-slate-200 text-center">
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
                Sistem Informasi BedTrack &copy; 2026
            </p>
        </footer>
    </div>
</div>