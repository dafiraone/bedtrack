<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ActionData } from './$types'; // Ini boleh dibiarkan, akan fix setelah npm run dev
    
    // Data error dari server
    export let form: ActionData;
    
    // State tab
    let activeTab = form?.role || 'admin'; 
</script>

<div class="min-h-screen flex bg-gray-50 font-sans">
    
    <div class="hidden lg:flex w-1/2 bg-blue-600 justify-center items-center relative overflow-hidden">
        <div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')]"></div>
        <div class="relative z-10 text-center text-white px-12">
            <div class="mb-6 text-8xl animate-bounce">🏥</div>
            <h1 class="text-5xl font-extrabold mb-4">BedTrack</h1>
            <p class="text-blue-100 text-xl font-light">
                Sistem Manajemen Alur Rawat Inap & Transparansi Pasien Terintegrasi.
            </p>
        </div>
    </div>

    <div class="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
        
        <div class="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-gray-800">Selamat Datang</h2>
                <p class="text-gray-500 mt-2">Silakan login untuk melanjutkan</p>
            </div>

            <div class="flex p-1 bg-gray-100 rounded-xl mb-8">
                <button 
                    type="button"
                    class="flex-1 py-2 rounded-lg text-sm font-bold transition-all
                    {activeTab === 'admin' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}"
                    on:click={() => activeTab = 'admin'}>
                    👨‍⚕️ Staff / Admin
                </button>
                <button 
                    type="button"
                    class="flex-1 py-2 rounded-lg text-sm font-bold transition-all
                    {activeTab === 'patient' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}"
                    on:click={() => activeTab = 'patient'}>
                    🤒 Pasien
                </button>
                
            </div>

            <form method="POST" use:enhance>
                
                {#if form?.error}
                    <div class="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg flex items-center gap-2 animate-pulse">
                        ⚠️ {form.error}
                    </div>
                {/if}

                {#if activeTab === 'admin'}
                    <input type="hidden" name="role" value="admin">
                    <div class="space-y-4">
                        <label class="block">
                            <span class="block text-sm font-medium text-gray-700 mb-1">Username</span>
                            <input type="text" name="username" placeholder="admin" 
                                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition" required>
                        </label>
                        <label class="block">
                            <span class="block text-sm font-medium text-gray-700 mb-1">Password</span>
                            <input type="password" name="password" placeholder="••••••" 
                                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition" required>
                        </label>
                        <button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-blue-200">
                            Masuk ke Dashboard
                        </button>
                    </div>
                    
                    <p class="text-xs text-center text-gray-400 mt-6">
                        Demo Account: User: <b>admin</b> | Pass: <b>admin</b>
                    </p>

                {:else}
                    <input type="hidden" name="role" value="patient">
                    <div class="space-y-4">
                        <label class="block">
                            <span class="block text-sm font-medium text-gray-700 mb-1">Patient ID</span>
                            <input type="text" name="patientId" placeholder="Contoh: 100" value={form?.patientId || ''}
                                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition" required>
                        </label>
                        <p class="text-xs text-gray-500">
                            Masukkan ID Pasien yang tertera pada gelang/kartu berobat.
                        </p>
                        <button class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-teal-200">
                            Cek Status Saya
                        </button>
                    </div>

                    <p class="text-xs text-center text-gray-400 mt-6">
                        Demo IDs: <b>100</b>, <b>101</b>, <b>1092</b> (Kamil Shah)
                    </p>
                {/if}

            </form>

            <div class="mt-6 pt-6 border-t border-slate-100 text-center">
    <p class="text-xs text-slate-400 mb-3">Tidak punya akun? Lihat status kapasitas umum:</p>
    <a href="/rooms" class="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 py-2 rounded-full text-xs font-bold transition-all">
        📊 Lihat Ketersediaan Ruangan (Guest)
    </a>
</div>
        </div>
        
        <p class="mt-8 text-sm text-gray-400">© 2025 BedTrack Hospital System</p>
    </div>
</div>