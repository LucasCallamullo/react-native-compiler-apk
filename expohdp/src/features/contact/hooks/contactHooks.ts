// src/features/contact/hooks/contactHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactService } from '../services/contactService';
import type { Contact, CreateContactRequest, UpdateContactRequest } from '../types/contactTypes';

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

export function useContactById(id: string | undefined) {
  const qc = useQueryClient();

  return useQuery({
    queryKey: ['contacts', id],
    queryFn: () => contactService.getById(id!),
    enabled: !!id,
    // Si ya tenemos la lista cacheada, hidratamos de ahí sin pegarle al server
    initialData: () => {
      // Leer del caché de la lista ['contacts']
      const list = qc.getQueryData<Contact[]>(['contacts']);
      // Buscar el contacto correspondiente por id
      return list?.find((c) => c.id === id);
    },
  });
}

export function useUpdateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateContactRequest }) =>
      contactService.update(id, payload),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: CONTACTS_KEY });
      qc.invalidateQueries({ queryKey: ['contacts', variables.id] });
    },
  });
}