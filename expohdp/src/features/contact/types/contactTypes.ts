import { ApiResponse } from '@shared/types/commonTypes';

// ============================================
// DOMAIN MODEL
// ============================================
export interface Contact {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  initial: string; // puede derivarse en el front, no siempre viene del back
}

// ============================================
// API PAYLOADS
// ============================================
export interface CreateContactRequest {
  name: string;
  email?: string | null;
  phone: string;
}

export interface UpdateContactRequest {
  name: string;
  email?: string;
  phone: string;
}

// ============================================
// API RESPONSES (Spring Boot wrapper)
// ============================================
export type ContactApiResponse = ApiResponse<Contact>;
export type ContactListApiResponse = ApiResponse<Contact[]>;
export type ContactDeleteApiResponse = ApiResponse<void>;