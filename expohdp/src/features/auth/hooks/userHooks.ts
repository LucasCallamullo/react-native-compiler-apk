// src/features/auth/hooks/userHooks.ts
import { useMutation } from '@tanstack/react-query';
import { userService } from '../services/userService';
import type { UpdateUserRequest } from '../types/userTypes';

export function useUpdateUser() {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserRequest }) =>
      userService.update(id, payload),
    // Sin onSuccess de invalidación porque no hay queryKey que invalidar.
    // El caller se encarga de actualizar el AuthContext / navegar.
  });
}

export function useDeleteUser() {
  return useMutation({
    mutationFn: (id: string) => userService.remove(id),
    // Igual: sin invalidaciones. El caller hace logout y navega.
  });
}