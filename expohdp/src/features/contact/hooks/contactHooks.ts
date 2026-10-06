// src/features/contact/hooks/contactHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactService } from '../services/contactService';
import type { CreateContactRequest, Contact } from '../types/contactTypes';

const CONTACTS_KEY = ['contacts'] as const;

export function useContacts() {
  return useQuery({
    queryKey: CONTACTS_KEY,
    queryFn: contactService.list,
  });
}

export function useCreateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateContactRequest) => contactService.create(payload),
    onSuccess: () => {
      // Invalida la cache de contacts → refetch automático en todas las pantallas
      qc.invalidateQueries({ queryKey: CONTACTS_KEY });
    },
  });
}

export function useDeleteContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contactService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CONTACTS_KEY }),
  });
}