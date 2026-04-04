import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Event {
  id: string;
  title: string;
  name: string;
  description: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
  category: string;
}

export interface EventFilters {
  isFeatured?: boolean;
  search?: string;
  limit?: number;
}

export function useEvents(filters: EventFilters = {}) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('id, title, description, location, start_date, end_date, image_url, is_featured, category')
        .order('start_date', { ascending: true })
        .limit(filters.limit ?? 12);

      if (filters.isFeatured !== undefined) query = query.eq('is_featured', filters.isFeatured);
      if (filters.search) query = query.ilike('title', `%${filters.search}%`);

      const { data, error } = await query;
      if (error) throw error;

      return (data ?? []).map((e) => ({
        id: e.id,
        title: e.title,
        name: e.title,
        description: e.description,
        location: e.location,
        startDate: e.start_date,
        endDate: e.end_date,
        imageUrl: e.image_url,
        isFeatured: e.is_featured,
        category: e.category,
      }));
    },
  });
}
