import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, queryKeys } from '@/lib/apiClient';

// Types
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

// Hooks
export function useEvents(filters: EventFilters = {}) {
  return useQuery({
    queryKey: queryKeys.events.list(filters),
    queryFn: () => apiClient.get<{ data: Event[]; pagination: any }>(`/events`, filters),
    select: (response) => response?.data || [],
  });
}

export function useFeaturedEvents() {
  return useQuery({
    queryKey: queryKeys.events.featured(),
    queryFn: () => apiClient.get<Event[]>(`/events/featured`),
    select: (response) => response?.data || [],
  });
}

export function useUpcomingEvents() {
  return useQuery({
    queryKey: queryKeys.events.upcoming(),
    queryFn: () => apiClient.get<Event[]>(`/events/upcoming`),
    select: (response) => response?.data || [],
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: queryKeys.events.detail(id),
    queryFn: () => apiClient.get<Event>(`/events/${id}`),
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Event>) => 
      apiClient.post<Event>(`/events`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) =>
      apiClient.put<Event>(`/events/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(`/events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
}

export function useFeatureEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      apiClient.put<Event>(`/events/${id}/feature`, { isFeatured }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
}

// Export page component
export { default as EventsPage } from './EventsPage';
