<script lang="ts">
    import { enhance } from '$app/forms';
    export let data;
    const { admission } = data;
</script>

<div class="p-8 max-w-2xl mx-auto font-sans">
    <header class="mb-10">
        <h1 class="text-2xl font-black text-slate-800">Edit <span class="text-blue-600">Admission</span></h1>
        <p class="text-slate-500 text-sm">Update data pasien: {admission.patients?.FName} (ID: {admission.patient_Id})</p>
    </header>

    <form method="POST" use:enhance class="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-4">
        <div>
            <label class="block text-[10px] font-black text-slate-400 mb-1">TEMPAT TIDUR</label>
            <select name="bedNo" class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-bold">
                {#each data.availableBeds as bed}
                    <option value={bed.bed_No} selected={bed.bed_No === admission.bed_No}>
                        Bed #{bed.bed_No} - {bed.ward?.ward_Name}
                    </option>
                {/each}
            </select>
        </div>

        <div>
            <label class="block text-[10px] font-black text-slate-400 mb-1">PERAWAT PJ</label>
            <select name="nurseId" class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-bold">
                {#each data.nurses as n}
                    <option value={n.nurse_Id} selected={n.nurse_Id === admission.nurse_Id}>
                        {n.FName} {n.LName}
                    </option>
                {/each}
            </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="block text-[10px] font-black text-slate-400 mb-1">BIAYA / DEPOSIT</label>
                <input name="amount" type="number" value={admission.amount} class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm outline-none" />
            </div>
            <div>
                <label class="block text-[10px] font-black text-slate-400 mb-1">EST. PULANG</label>
                <input name="estDischarge" type="date" value={admission.discharge_Date?.toISOString().split('T')[0]} class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm outline-none" />
            </div>
        </div>

        <button class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition-all">
            SIMPAN PERUBAHAN DATA
        </button>
        <a href="/admin" class="block text-center text-xs text-slate-400 font-bold hover:underline">Batal & Kembali</a>
    </form>
</div>