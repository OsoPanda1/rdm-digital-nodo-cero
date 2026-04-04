import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Post {
  id: string;
  userName: string;
  userAvatar: string | null;
  content: string;
  imageUrl: string | null;
  placeName: string | null;
  likes: number;
  comments: number;
  createdAt: string;
}

export function useCommunityPosts() {
  return useQuery({
    queryKey: ['community-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_posts')
        .select('id, author_name, author_avatar, content, image_url, place_name, likes, created_at')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(9);

      if (error) throw error;

      return (data ?? []).map((p) => ({
        id: p.id,
        userName: p.author_name,
        userAvatar: p.author_avatar,
        content: p.content,
        imageUrl: p.image_url,
        placeName: p.place_name,
        likes: p.likes,
        comments: 0,
        createdAt: p.created_at,
      }));
    },
  });
}
