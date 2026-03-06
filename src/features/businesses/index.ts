import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, queryKeys } from '@/lib/apiClient';

// Types
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
  owner?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface BusinessFilters {
  category?: string;
  isPremium?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

// Hooks
export function useBusinesses(filters: BusinessFilters = {}) {
  return useQuery({
    queryKey: queryKeys.businesses.list(filters),
    queryFn: () => apiClient.get<{ data: Business[]; pagination: any }>(`/businesses`, filters),
    select: (response) => response?.data || [],
  });
}

export function useBusiness(id: string) {
  return useQuery({
    queryKey: queryKeys.businesses.detail(id),
    queryFn: () => apiClient.get<Business>(`/businesses/${id}`),
    enabled: !!id,
  });
}

export function useBusinessCategories() {
  return useQuery({
    queryKey: queryKeys.businesses.categories(),
    queryFn: () => apiClient.get<string[]>(`/businesses/categories`),
    select: (response) => response?.data || [],
  });
}

export function useCreateBusiness() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Business>) => 
      apiClient.post<Business>(`/businesses`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.all });
    },
  });
}

export function useUpdateBusiness() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Business> }) =>
      apiClient.put<Business>(`/businesses/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.all });
    },
  });
}

export function useDeleteBusiness() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(`/businesses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.all });
    },
  });
}

export function useUpgradeBusiness() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ businessId, plan }: { businessId: string; plan: 'monthly' | 'yearly' }) =>
      apiClient.post<{ sessionId: string; url: string }>(`/payments/business/checkout`, { 
        businessId, 
        plan 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.all });
    },
  });
}

// Export page component
export { default as BusinessesPage } from './BusinessesPage';
