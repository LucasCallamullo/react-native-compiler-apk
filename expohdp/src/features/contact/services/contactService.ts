import apiClient from '@shared/api/client';
import { getUseMock } from '@shared/config/devConfig';
import {
  Contact,
  ContactApiResponse,
  ContactListApiResponse,
  CreateContactRequest,
  UpdateContactRequest,
} from '../types/contactTypes';

// ============================================
// MOCK DATA
// ============================================
const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'Juan Pérez', phone: '+54 11 2345-6789', initial: 'J' },
  { id: '2', name: 'María García', phone: '+54 11 3456-7890', initial: 'M' },
  { id: '3', name: 'Luis Fernández', phone: '+54 11 4567-8901', initial: 'L' },
];

// Helper para derivar initial si el backend no lo manda
const withInitial = (contact: Omit<Contact, 'initial'>): Contact => ({
  ...contact,
  initial: contact.name?.[0]?.toUpperCase() ?? '?',
});

// ============================================
// CONTACT SERVICE
// ============================================
export const contactService = {
  /**
   * Fetches the list of emergency contacts for the current user.
   */
  list: async (): Promise<Contact[]> => {
    if (getUseMock()) return MOCK_CONTACTS;

    const response = await apiClient.get<ContactListApiResponse>('/v1/contacts');
    return response.data.data.map(withInitial);
  },

  /**
   * Fetches a single contact by ID.
   */
  getById: async (id: string): Promise<Contact> => {
    if (getUseMock()) {
      const found = MOCK_CONTACTS.find((c) => c.id === id);
      if (!found) throw new Error('Contact not found');
      return found;
    }

    const response = await apiClient.get<ContactApiResponse>(`/v1/contacts/${id}`);
    return withInitial(response.data.data);
  },

  /**
   * Creates a new emergency contact.
   */
  create: async (payload: CreateContactRequest): Promise<Contact> => {
    if (getUseMock()) {
      const newContact = withInitial({
        id: String(Date.now()),
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
      });
      MOCK_CONTACTS.push(newContact);
      return newContact;
    }

    const response = await apiClient.post<ContactApiResponse>('/v1/contacts', payload);
    return withInitial(response.data.data);
  },

  /**
   * Updates an existing contact.
   */
  update: async (id: string, payload: UpdateContactRequest): Promise<Contact> => {
    if (getUseMock()) {
      const idx = MOCK_CONTACTS.findIndex((c) => c.id === id);
      if (idx === -1) throw new Error('Contact not found');
      MOCK_CONTACTS[idx] = { ...MOCK_CONTACTS[idx], ...payload };
      return MOCK_CONTACTS[idx];
    }

    const response = await apiClient.patch<ContactApiResponse>(
      `/v1/contacts/${id}`,
      payload
    );
    return withInitial(response.data.data);
  },

  /**
   * Deletes a contact.
   */
  remove: async (id: string): Promise<void> => {
    if (getUseMock()) {
      const idx = MOCK_CONTACTS.findIndex((c) => c.id === id);
      if (idx !== -1) MOCK_CONTACTS.splice(idx, 1);
      return;
    }

    await apiClient.delete(`/v1/contacts/${id}`);
  },
};