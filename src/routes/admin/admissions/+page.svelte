<script lang="ts">
    import { enhance } from '$app/forms';
    export let data;
    export let form;
</script>

<div class="p-8 max-w-4xl mx-auto font-sans">
    <header class="mb-10 text-center">
        <h1 class="text-3xl font-black text-slate-800">Patient <span class="text-blue-600">Admission</span></h1>
        <p class="text-slate-500 text-sm mt-2">Alokasi tempat tidur pasien rawat inap sesuai standar SC4-SC6.</p>
    </header>

    {#if form?.message}
        <div class="mb-6 p-4 bg-red-100 text-red-700 rounded-xl font-bold text-sm animate-bounce text-center">
            ⚠️ {form.message}
        </div>
    {/if}

    <form method="POST" action="?/admit" use:enhance class="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label class="block text-[10px] font-black uppercase text-slate-400 mb-2">Pilih Pasien</label>
                <select name="patientId" required class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:border-blue-500 transition-all">
                    {#each data.patients as p}
                        <option value={p.patient_Id}>{p.FName} {p.LName} (ID: {p.patient_Id})</option>
                    {/each}
                </select>
            </div>

            <div>
                <label class="block text-[10px] font-black uppercase text-slate-400 mb-2">Bed Tersedia</label>
                <select name="bedNo" required class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:border-blue-500 transition-all">
                    {#each data.availableBeds as bed}
                        <option value={bed.bed_No}>Bed #{bed.bed_No} - {bed.ward?.ward_Name}</option>
                    {/each}
                </select>
            </div>

            <div>
                <label class="block text-[10px] font-black uppercase text-slate-400 mb-2">Perawat Penanggung Jawab</label>
                <select name="nurseId" required class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:border-blue-500 transition-all">
                    {#each data.nurses as n}
                        <option value={n.nurse_Id}>{n.FName} {n.LName}</option>
                    {/each}
                </select>
            </div>

            <div>
                <label class="block text-[10px] font-black uppercase text-slate-400 mb-2">Biaya Kamar / Deposit</label>
                <input name="deposit" type="number" value="500000" class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm outline-none focus:border-blue-500" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-[10px] font-black uppercase text-slate-400 mb-2">Estimasi Tanggal Pulang</label>
                    <input 
                        name="estDischarge" 
                        type="date" 
                        required 
                        class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-bold outline-none focus:border-blue-500 transition-all" 
                    />
                    <p class="text-[9px] text-slate-400 mt-1 italic">*Digunakan untuk kalkulasi ketersediaan bed di masa depan.</p>
                </div>
            </div>
        </div>

        <button class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
            PROSES PENEMPATAN BED
        </button>
    </form>
</div>