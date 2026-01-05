<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
</script>

<div class="min-h-screen bg-gray-50 flex justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
    <div class="w-full max-w-md bg-white min-h-screen shadow-2xl relative">
        
        <div class="bg-blue-600 p-6 rounded-b-3xl shadow-lg text-white text-center">
            <h1 class="text-xl font-bold tracking-widest">BEDTRACK</h1>
            <p class="text-blue-200 text-xs">Patient Companion App</p>
        </div>

        <div class="p-6">
            {#if data.found && data.bed && data.bed.patient}
                <div class="mb-6">
                    <p class="text-gray-500">Halo,</p>
                    <h2 class="text-3xl font-bold text-gray-800">{data.bed.patient.name}</h2>
                    <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
                        ID: {data.bed.patient.id}
                    </span>
                </div>

                <div class="bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden mb-6">
                    <div class="p-6 text-center 
                        {data.bed.status === 'occupied' ? 'bg-green-50' : 'bg-yellow-50'}">
                        
                        {#if data.bed.status === 'occupied'}
                            <div class="text-5xl mb-2">🛏️</div>
                            <h3 class="text-xl font-bold text-green-700">Sedang Dirawat</h3>
                            <p class="text-green-600 text-sm">Anda dalam masa perawatan.</p>
                        {:else if data.bed.status === 'discharging'}
                            <div class="text-5xl mb-2">👋</div>
                            <h3 class="text-xl font-bold text-yellow-700">Persiapan Pulang</h3>
                            <p class="text-yellow-600 text-sm">Silakan bersiap-siap.</p>
                        {/if}
                    </div>

                    <div class="p-6 space-y-4">
                        <div class="flex justify-between border-b pb-2">
                            <span class="text-gray-400">Lokasi</span>
                            <span class="font-bold text-gray-700 text-right">{data.bed.ward_Name}</span>
                        </div>
                        <div class="flex justify-between border-b pb-2">
                            <span class="text-gray-400">No. Bed</span>
                            <span class="font-bold text-gray-700 text-xl">#{data.bed.bed_No}</span>
                        </div>
                        <div class="flex justify-between border-b pb-2">
                            <span class="text-gray-400">Masuk</span>
                            <span class="font-bold text-gray-700">{data.bed.patient.admissionDate}</span>
                        </div>
                         <div class="flex justify-between pt-2">
                            <span class="text-gray-400">Est. Pulang</span>
                            <span class="font-bold text-blue-600">{data.bed.patient.dischargeDate}</span>
                        </div>
                    </div>
                </div>

                <button class="w-full bg-slate-800 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-slate-700 transition">
                    📞 Panggil Perawat
                </button>

            {:else}
                <div class="text-center mt-20">
                    <div class="text-6xl mb-4">🤷‍♂️</div>
                    <h2 class="text-xl font-bold text-gray-700">Data Tidak Ditemukan</h2>
                    <p class="text-gray-500 mt-2">
                        Pasien dengan ID <span class="font-mono bg-gray-200 px-1">{data.patientId}</span> 
                        tidak sedang dirawat saat ini.
                    </p>
                    <a href="/" class="block mt-8 text-blue-600 underline">Kembali ke Dashboard</a>
                </div>
            {/if}
        </div>
    </div>
</div>