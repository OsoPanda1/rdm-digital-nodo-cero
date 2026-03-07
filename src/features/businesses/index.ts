import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, queryKeys } from '@/lib/apiClient';

export interface Business {
  id: string;
  ownerId: string;
  name: string;
  category: string;
  description: string;
  phone?: string;
  address?: string;
  imageUrl?: string;
  website?: string;
  email?: string;
  isPremium: boolean;
  premiumUntil?: string;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  owner?: { id: string; name: string; email: string };
}

export interface BusinessFilters {
  category?: string;
  isPremium?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export function useBusinesses(filters: BusinessFilters = {}) {
  return useQuery({
    queryKey: queryKeys.businesses.list(filters as Record<string, any>),
    queryFn: () => apiClient.get<{ success: boolean; data: Business[]; pagination: any }>(`/businesses`, filters as Record<string, any>),
    select: (res) => res?.data || [],
  });
}

export function useBusiness(id: string) {
  return useQuery({
    queryKey: queryKeys.businesses.detail(id),
    queryFn: () => apiClient.get<{ success: boolean; data: Business }>(`/businesses/${id}`),
    enabled: !!id,
    select: (res) => res?.data,
  });
}

export function useBusinessCategories() {
  return useQuery({
    queryKey: queryKeys.businesses.categories(),
    queryFn: () => apiClient.get<{ success: boolean; data: string[] }>(`/businesses/categories`),
    select: (res) => res?.data || [],
  });
}

export function useCreateBusiness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Business>) => apiClient.post<Business>(`/businesses`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.businesses.all }); },
  });
}

export function useUpdateBusiness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Business> }) => apiClient.put<Business>(`/businesses/${id}`, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.businesses.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.businesses.all });
    },
  });
}

export function useDeleteBusiness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(`/businesses/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.businesses.all }); },
  });
}

export function useUpgradeBusiness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ businessId, plan }: { businessId: string; plan: 'monthly' | 'yearly' }) =>
      apiClient.post<{ sessionId: string; url: string }>(`/payments/business/checkout`, { businessId, plan }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.businesses.all }); },
  });
}
