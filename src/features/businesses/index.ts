import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
  shortDescription: string | null;
  phone: string | null;
  address: string | null;
  imageUrl: string | null;
  isPremium: boolean;
  isVerified: boolean;
  isFeatured: boolean;
  rating: number | null;
  status: string;
}

export interface BusinessFilters {
  category?: string;
  isPremium?: boolean;
  search?: string;
  limit?: number;
}

export function useBusinesses(filters: BusinessFilters = {}) {
  return useQuery({
    queryKey: ['businesses', filters],
    queryFn: async () => {
      let query = supabase
        .from('businesses')
        .select('id, name, category, description, short_description, phone, address, image_url, is_premium, is_verified, is_featured, rating, status')
        .eq('status', 'active')
        .order('is_featured', { ascending: false })
        .limit(filters.limit ?? 12);

      if (filters.category) query = query.eq('category', filters.category);
      if (filters.isPremium !== undefined) query = query.eq('is_premium', filters.isPremium);
      if (filters.search) query = query.ilike('name', `%${filters.search}%`);

      const { data, error } = await query;
      if (error) throw error;

      return (data ?? []).map((b) => ({
        id: b.id,
        name: b.name,
        category: b.category,
        description: b.description,
        shortDescription: b.short_description,
        phone: b.phone,
        address: b.address,
        imageUrl: b.image_url,
        isPremium: b.is_premium,
        isVerified: b.is_verified,
        isFeatured: b.is_featured,
        rating: b.rating ? Number(b.rating) : null,
        status: b.status,
      }));
    },
  });
}
