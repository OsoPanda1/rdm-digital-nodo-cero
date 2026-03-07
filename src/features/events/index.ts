import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, queryKeys } from '@/lib/apiClient';

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate?: string;
  imageUrl?: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventFilters {
  isFeatured?: boolean;
  startDate?: string;
  endDate?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export function useEvents(filters: EventFilters = {}) {
  return useQuery({
    queryKey: queryKeys.events.list(filters as Record<string, any>),
    queryFn: () => apiClient.get<{ success: boolean; data: Event[]; pagination: any }>(`/events`, filters as Record<string, any>),
    select: (res) => res?.data || [],
  });
}

export function useFeaturedEvents() {
  return useQuery({
    queryKey: queryKeys.events.featured(),
    queryFn: () => apiClient.get<{ success: boolean; data: Event[] }>(`/events/featured`),
    select: (res) => res?.data || [],
  });
}

export function useUpcomingEvents() {
  return useQuery({
    queryKey: queryKeys.events.upcoming(),
    queryFn: () => apiClient.get<{ success: boolean; data: Event[] }>(`/events/upcoming`),
    select: (res) => res?.data || [],
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: queryKeys.events.detail(id),
    queryFn: () => apiClient.get<{ success: boolean; data: Event }>(`/events/${id}`),
    enabled: !!id,
    select: (res) => res?.data,
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Event>) => apiClient.post<Event>(`/events`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.events.all }); },
  });
}

export function useUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) => apiClient.put<Event>(`/events/${id}`, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.events.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(`/events/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.events.all }); },
  });
}

export function useFeatureEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) => apiClient.put<Event>(`/events/${id}/feature`, { isFeatured }),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.events.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
}
