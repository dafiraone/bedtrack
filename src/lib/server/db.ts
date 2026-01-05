import {prisma} from './prisma';
import bcrypt from 'bcryptjs';

export const authenticateUser = async (username: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { username }
  });

  if (!user) return null;

  // GUNAKAN INI: Membandingkan password input dengan hash di database
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) return null;

  return {
    id: user.id,
    username: user.username,
    role: user.role
  };
};

export const createUser = async (username: string, password: string, role: string = 'admin') => {
  const hashed = await bcrypt.hash(password, 10);
  return await prisma.user.create({
    data: { username, password: hashed, role }
  });
};


export const verifyPatient = async (id: string) => {
  return await prisma.patients.findUnique({
    where: { patient_Id: parseInt(id) }
  });
};

// src/lib/server/db.ts (potongan penting)
// src/lib/server/db.ts

export const getBedData = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const beds = await prisma.bed.findMany({
    include: {
      ward: true,
      bedrecords: {
        where: {
          OR: [
            { discharge_Date: { gte: today } },
            { discharge_Date: null }
          ]
        },
        include: { 
          patients: {
            select: { patient_Id: true, FName: true, LName: true }
          }
        },
        orderBy: { admission_Date: 'desc' },
        take: 1
      }
    }
  });

  return beds.map(bed => {
    const record = bed.bedrecords[0];
    let status = 'available';
    if (record) {
        status = 'occupied';
        
        if (record.discharge_Date) {
            const dDate = new Date(record.discharge_Date);
            dDate.setHours(0,0,0,0);
            
            if (dDate.getTime() === today.getTime()) {
                status = 'discharging'; // Kuning (Hari ini)
            } else if (dDate.getTime() < today.getTime()) {
                status = 'overdue';     // Merah Gelap/Hitam (Sudah lewat!)
            }
        }
    }
    
    return {
      bed_No: bed.bed_No,
      ward_Name: bed.ward?.ward_Name || 'Umum',
      status,
      patient: record ? {
        admissionId: record.admission_Id, 
        id: record.patients?.patient_Id?.toString() || '',
        name: `${record.patients?.FName || ''} ${record.patients?.LName || ''}`.trim(),
        admissionDate: record.admission_Date ? new Date(record.admission_Date).toLocaleDateString('id-ID') : 'N/A',
        dischargeDate: record.discharge_Date ? new Date(record.discharge_Date).toLocaleDateString('id-ID') : 'N/A'
      } : null
    };
  });
};


// FUNGSI BARU untuk fitur lengkap
export const dischargePatient = async (admissionId: number) => {
  return await prisma.bedrecords.update({
    where: { admission_Id: admissionId },
    data: { discharge_Date: new Date() }
  });
};


export const getPatientHistory = async (patientId: number) => {
  return await prisma.patients.findUnique({
    where: { patient_Id: patientId },
    include: {
      bedrecords: {
        include: { bed: { include: { ward: true } } }
      },
      appointment: true,
      medicalrecord: true
    }
  });
};

export const getDoctorsByDept = async (deptId?: number) => {
  return await prisma.doctor.findMany({
    where: deptId ? { dept_Id: deptId } : {},
    include: { department: true }
  });
};

// --- READ: Mengambil semua user ---
export const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: { id: true, username: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' }
    });
};

// --- CREATE: Menambah user baru dengan Audit Trail (SC6) ---
export const createAdminUser = async (username: string, pass: string, role: string) => {
    const hashedPassword = await bcrypt.hash(pass, 10);
    return await prisma.user.create({
        data: { username, password: hashedPassword, role }
    });
};

// --- DELETE: Menghapus user ---
export const deleteAdminUser = async (id: number) => {
    return await prisma.user.delete({ where: { id } });
};

// --- SC4: Operational Export Logic ---
// Fungsi untuk memformat data ke CSV untuk kebutuhan pelaporan operasional (Module 9)
export const getStaffReportCSV = async () => {
    const users = await getAllUsers();
    const header = "ID,Username,Role,CreatedAt\n";
    const rows = users.map(u => `${u.id},${u.username},${u.role},${u.createdAt}`).join("\n");
    return header + rows;
};

// --- WARD CRUD ---
export const createWard = async (wardNo: number, name: string, deptId: number) => {
    return await prisma.$transaction(async (tx) => {
        const newWard = await tx.ward.create({
            data: { ward_No: wardNo, ward_Name: name, dept_Id: deptId }
        });
        await tx.auditLog.create({
            data: { action: "CREATE_WARD", adminName: "Admin", details: `Menambah Bangsal: ${name} (No: ${wardNo})` }
        });
        return newWard;
    });
};

export const deleteWard = async (wardNo: number) => {
    return await prisma.ward.delete({ where: { ward_No: wardNo } });
};

// --- BED CRUD ---
export const createBed = async (bedNo: number, wardNo: number) => {
    return await prisma.$transaction(async (tx) => {
        const newBed = await tx.bed.create({
            data: { bed_No: bedNo, ward_No: wardNo }
        });
        await tx.auditLog.create({
            data: { action: "CREATE_BED", adminName: "Admin", details: `Menambah Bed #${bedNo} ke Bangsal ${wardNo}` }
        });
        return newBed;
    });
};

// --- READ DATA UNTUK FORM ---
export const getWardManagementData = async () => {
    const wards = await prisma.ward.findMany({ include: { department: true, bed: true } });
    const departments = await prisma.department.findMany();
    return { wards, departments };
};

// --- CREATE: Admit Patient (Memasukkan Pasien ke Bed) ---
export const admitPatient = async (data: { 
    patientId: number, 
    bedNo: number, 
    nurseId: number, 
    amount: number,
    estDischarge: string // Tambahkan parameter ini
}) => {
    return await prisma.$transaction(async (tx) => {
        const admission = await tx.bedrecords.create({
            data: {
                admission_Id: Math.floor(Math.random() * 1000000),
                patient_Id: data.patientId,
                bed_No: data.bedNo,
                nurse_Id: data.nurseId,
                admission_Date: new Date(),
                discharge_Date: new Date(data.estDischarge), // Simpan sebagai estimasi
                amount: data.amount,
                mode_of_payment: 'BPJS/Asuransi'
            }
        });

        // SC6: Audit Log untuk melacak pendaftaran
        await tx.auditLog.create({
            data: { 
                action: "ADMIT_PATIENT", 
                adminName: "Admin", 
                details: `Pasien ${data.patientId} masuk (Est. Pulang: ${data.estDischarge})` 
            }
        });

        return admission;
    });
};

// --- READ: Data untuk Dropdown Form ---
export const getAdmissionFormData = async () => {
    const availableBeds = await prisma.bed.findMany({
        where: { bedrecords: { none: { discharge_Date: null } } },
        include: { ward: true }
    });
    const patients = await prisma.patients.findMany();
    const nurses = await prisma.nurse.findMany();
    
    return { availableBeds, patients, nurses };
};

export const getAdmissionById = async (admissionId: number) => {
    return await prisma.bedrecords.findUnique({
        where: { admission_Id: admissionId },
        include: { patients: true, bed: true, nurse: true }
    });
};

// Fungsi Update dengan Audit Trail
export const updateAdmission = async (id: number, data: any) => {
    return await prisma.$transaction(async (tx) => {
        const updated = await tx.bedrecords.update({
            where: { admission_Id: id },
            data: {
                bed_No: data.bedNo,
                nurse_Id: data.nurseId,
                amount: data.amount,
                discharge_Date: data.estDischarge ? new Date(data.estDischarge) : null,
                mode_of_payment: data.paymentMode
            }
        });

        // SC6: Mencatat perubahan untuk akuntabilitas
        await tx.auditLog.create({
            data: {
                action: "UPDATE_ADMISSION",
                adminName: "Admin",
                details: `Mengubah data admisi ID: ${id}. Bed baru: ${data.bedNo}`
            }
        });
        return updated;
    });
};

// src/lib/server/db.ts

export const getFullReportData = async () => {
    // SC4: Mengambil data relasional untuk pelaporan operasional
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const report = await prisma.bed.findMany({
        include: {
            ward: { include: { department: true } },
            bedrecords: {
                where: {
                    OR: [
                        { discharge_Date: { gte: today } }, // Termasuk yang estimasi pulangnya hari ini/nanti
                        { discharge_Date: null }
                    ]
                },
                include: { patients: true }
            }
        }
    });

    return report.map(b => ({
        bedNo: b.bed_No,
        wardName: b.ward?.ward_Name || 'Umum',
        deptName: b.ward?.department?.dept_Name || 'N/A',
        status: b.bedrecords.length > 0 ? 'Terisi' : 'Tersedia',
        patientName: b.bedrecords[0]?.patients ? 
            `${b.bedrecords[0].patients.FName} ${b.bedrecords[0].patients.LName}` : '-',
        admissionDate: b.bedrecords[0]?.admission_Date ? 
            new Date(b.bedrecords[0].admission_Date).toLocaleDateString('id-ID') : '-'
    }));
};

