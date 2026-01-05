<script lang="ts">
    import { enhance } from '$app/forms';
    export let data;

    // Fungsi untuk SC4: Operational Data Handling (Export CSV)
    function downloadCSV() {
        const headers = "ID,Username,Role,Date\n";
        const rows = data.users.map(u => `${u.id},${u.username},${u.role},${u.createdAt}`).join("\n");
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'staff_governance_report.csv';
        a.click();
    }
</script>

<div class="p-8 max-w-6xl mx-auto font-sans">
    <div class="flex justify-between items-center mb-10">
        <div>
            <h1 class="text-3xl font-black text-slate-800 tracking-tight">Staff <span class="text-blue-600">Governance</span></h1>
            <p class="text-slate-500 text-sm">Kelola akses sistem dan akuntabilitas personil rumah sakit (SC5/SC6).</p>
        </div>
        <button on:click={downloadCSV} class="bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-700 transition-all shadow-lg flex items-center gap-2">
            📥 Export Report (SC4)
        </button>
    </div>

    <section class="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm mb-8">
        <h2 class="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Registrasi Staff Baru</h2>
        <form method="POST" action="?/create" use:enhance class="flex flex-wrap gap-4 items-end">
            <div class="flex-grow min-w-[200px]">
                <label class="block text-[10px] font-bold mb-1 ml-1">USERNAME</label>
                <input name="username" type="text" required class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm focus:border-blue-500 outline-none" />
            </div>
            <div class="flex-grow min-w-[200px]">
                <label class="block text-[10px] font-bold mb-1 ml-1">PASSWORD</label>
                <input name="password" type="password" required class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm focus:border-blue-500 outline-none" />
            </div>
            <div>
                <label class="block text-[10px] font-bold mb-1 ml-1">ROLE</label>
                <select name="role" class="bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-bold outline-none">
                    <option value="admin">ADMIN</option>
                    <option value="doctor">DOCTOR</option>
                    <option value="nurse">NURSE</option>
                </select>
            </div>
            <button class="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-black hover:bg-blue-700 transition-all shadow-md shadow-blue-100">ADD STAFF</button>
        </form>
    </section>

    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table class="w-full text-left">
            <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th class="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Username</th>
                    <th class="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Akses / Role</th>
                    <th class="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Terdaftar</th>
                    <th class="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {#each data.users as user}
                    <tr class="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td class="p-4 font-bold text-slate-700">@{user.username}</td>
                        <td class="p-4">
                            <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase 
                                {user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}">
                                {user.role}
                            </span>
                        </td>
                        <td class="p-4 text-xs text-slate-400 font-medium">
                            {new Date(user.createdAt).toLocaleDateString('id-ID')}
                        </td>
                        <td class="p-4 text-right">
                            <form method="POST" action="?/delete" use:enhance>
                                <input type="hidden" name="id" value={user.id} />
                                <button class="text-red-400 hover:text-red-600 font-black text-[10px] uppercase transition-colors">Terminate</button>
                            </form>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>