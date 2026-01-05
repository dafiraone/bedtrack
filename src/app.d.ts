// src/app.d.ts
/// <reference types="@sveltejs/kit" />

// Extend App.Locals untuk locals.user
declare namespace App {
  interface Locals {
    user: {
      id: number;
      username: string;
      role: string;
    } | null;
  }

  interface PageData {
    beds: Array<{
      bed_No: number;
      ward_Name: string;
      status: 'available' | 'occupied' | 'discharging';
      patient: {
        id: string;
        name: string;
        admissionDate?: string;
        dischargeDate?: string;
      } | null;
    }>;
    stats: {
      total: number;
      available: number;
      occupied: number;
      discharging: number;
    };
    patientDetail?: any;
    search?: string;
  }

  // interface Error {}
  // interface Platform {}
}
