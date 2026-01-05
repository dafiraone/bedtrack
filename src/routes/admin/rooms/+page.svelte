<script lang="ts">
    import { enhance } from '$app/forms';
    export let data;
</script>

<div class="p-8 max-w-7xl mx-auto font-sans">
    <header class="mb-10">
        <h1 class="text-3xl font-black text-slate-800">Infrastruktur <span class="text-blue-600">Kapasitas</span></h1>
        <p class="text-slate-500 text-sm">Manajemen ekspansi bangsal dan unit tempat tidur rumah sakit (SC4/SC6).</p>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 class="font-black text-slate-700 mb-6 flex items-center gap-2">🏢 Tambah Bangsal Baru</h2>
            <form method="POST" action="?/addWard" use:enhance class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[10px] font-bold text-slate-400 mb-1">NO BANGSAL</label>
                        <input name="wardNo" type="number" required class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-slate-400 mb-1">DEPARTEMEN</label>
                        <select name="deptId" class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-bold outline-none">
                            {#each data.departments as dept}
                                <option value={dept.dept_Id}>{dept.dept_Name}</option>
                            {/each}
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-[10px] font-bold text-slate-400 mb-1">NAMA BANGSAL</label>
                    <input name="wardName" type="text" placeholder="Contoh: Bangsal Mawar" required class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm outline-none focus:border-blue-500" />
                </div>
                <button class="w-full bg-slate-800 text-white py-3 rounded-xl font-black text-sm hover:bg-slate-700 transition-all">DAFTARKAN BANGSAL</button>
            </form>
        </section>

        <section class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 class="font-black text-slate-700 mb-6 flex items-center gap-2">🛏️ Tambah Unit Bed</h2>
            <form method="POST" action="?/addBed" use:enhance class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-[10px] font-bold text-slate-400 mb-1">NO BED</label>
                        <input name="bedNo" type="number" required class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-slate-400 mb-1">LOKASI BANGSAL</label>
                        <select name="wardNo" class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-bold outline-none">
                            {#each data.wards as ward}
                                <option value={ward.ward_No}>[{ward.ward_No}] {ward.ward_Name}</option>
                            {/each}
                        </select>
                    </div>
                </div>
                <button class="w-full bg-blue-600 text-white py-3 rounded-xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">AKTIFKAN UNIT BED</button>
            </form>
        </section>
    </div>

    <div class="mt-10 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table class="w-full text-left">
            <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th class="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Ruangan / Bangsal</th>
                    <th class="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Departemen</th>
                    <th class="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Total Unit Bed</th>
                </tr>
            </thead>
            <tbody>
                {#each data.wards as ward}
                    <tr class="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td class="p-5">
                            <p class="font-black text-slate-700 text-lg">{ward.ward_Name}</p>
                            <p class="text-[10px] font-bold text-slate-400 uppercase">NO: {ward.ward_No}</p>
                        </td>
                        <td class="p-5">
                            <span class="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight">
                                {ward.department?.dept_Name || 'Umum'}
                            </span>
                        </td>
                        <td class="p-5 text-center">
                            <span class="text-2xl font-black text-slate-800">{ward.bed.length}</span>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>