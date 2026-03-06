import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, queryKeys } from '@/lib/apiClient';
import type { ApiResponse } from '@/lib/apiClient';

// Types
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

// Hooks
export function usePlaces(filters: PlaceFilters = {}) {
  return useQuery({
    queryKey: queryKeys.places.list(filters),
    queryFn: () => apiClient.get<Place[]>(`/markers`, filters),
    select: (data) => data?.data || [],
  });
}

export function usePlace(id: string) {
  return useQuery({
    queryKey: queryKeys.places.detail(id),
    queryFn: () => apiClient.get<Place>(`/markers/${id}`),
    enabled: !!id,
  });
}

export function usePlaceCategories() {
  return useQuery({
    queryKey: queryKeys.places.all,
    queryFn: () => apiClient.get<string[]>(`/markers/categories`),
    select: (data) => data?.data || [],
  });
}

export function useCreatePlace() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Place>) => 
      apiClient.post<Place>(`/markers`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.places.all });
    },
  });
}

export function useUpdatePlace() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Place> }) =>
      apiClient.put<Place>(`/markers/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.places.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.places.all });
    },
  });
}

export function useDeletePlace() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(`/markers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.places.all });
    },
  });
}

// Export page component
export { default as PlacesPage } from './PlacesPage';
