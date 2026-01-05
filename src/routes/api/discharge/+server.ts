// src/routes/api/discharge/+server.ts
import { json } from '@sveltejs/kit';
import { dischargePatient } from '$lib/server/db';
import type { RequestHandler } from './$types';
import {prisma} from '../../../lib/server/prisma'

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { bedId, patientId, patientName } = await request.json();
    
    // Cari admission_Id aktif untuk bed ini
    const activeRecord = await prisma.bedrecords.findFirst({
      where: {
        bed_No: parseInt(bedId),
        discharge_Date: null  // belum discharge
      }
    });

    if (!activeRecord) {
      return json({ success: false, message: 'Tidak ada pasien aktif di bed ini' }, { status: 404 });
    }

    // Update discharge
    await dischargePatient(activeRecord.admission_Id);
    
    return json({ 
      success: true, 
      message: `✅ Pasien ${patientName} (ID: ${patientId}) berhasil diproses discharge dari Bed #${bedId}`
    });
  } catch (error) {
    console.error('Discharge error:', error);
    return json({ success: false, message: 'Server error' }, { status: 500 });
  }
};
