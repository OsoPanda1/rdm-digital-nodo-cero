import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, queryKeys } from '@/lib/apiClient';

export interface Place {
  id: string;
  name: string;
  category: string;
  description?: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  isPremiumBusiness?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlaceFilters {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export function usePlaces(filters: PlaceFilters = {}) {
  return useQuery({
    queryKey: queryKeys.places.list(filters as Record<string, any>),
    queryFn: () => apiClient.get<{ success: boolean; data: Place[] }>(`/markers`, filters as Record<string, any>),
    select: (res) => res?.data || [],
  });
}

export function usePlace(id: string) {
  return useQuery({
    queryKey: queryKeys.places.detail(id),
    queryFn: () => apiClient.get<{ success: boolean; data: Place }>(`/markers/${id}`),
    enabled: !!id,
    select: (res) => res?.data,
  });
}

export function usePlaceCategories() {
  return useQuery({
    queryKey: queryKeys.places.all,
    queryFn: () => apiClient.get<{ success: boolean; data: string[] }>(`/markers/categories`),
    select: (res) => res?.data || [],
  });
}

export function useCreatePlace() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Place>) => apiClient.post<Place>(`/markers`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.places.all }); },
  });
}

export function useUpdatePlace() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Place> }) => apiClient.put<Place>(`/markers/${id}`, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.places.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.places.all });
    },
  });
}

export function useDeletePlace() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(`/markers/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.places.all }); },
  });
}
