import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Place {
  id: string;
  name: string;
  category: string;
  description: string;
  lat: number;
  lng: number;
  imageUrl: string | null;
  isPremiumBusiness: boolean;
  isActive: boolean;
}

export interface PlaceFilters {
  category?: string;
  search?: string;
  limit?: number;
}

export function usePlaces(filters: PlaceFilters = {}) {
  return useQuery({
    queryKey: ['places', filters],
    queryFn: async () => {
      let query = supabase
        .from('businesses')
        .select('id, name, category, description, latitude, longitude, image_url, is_premium, status')
        .eq('status', 'active')
        .order('is_featured', { ascending: false })
        .limit(filters.limit ?? 8);

      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data ?? []).map((b) => ({
        id: b.id,
        name: b.name,
        category: b.category,
        description: b.description,
        lat: b.latitude ?? 20.1374,
        lng: b.longitude ?? -98.6732,
        imageUrl: b.image_url,
        isPremiumBusiness: b.is_premium,
        isActive: b.status === 'active',
      }));
    },
  });
}
