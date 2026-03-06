import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, queryKeys } from '@/lib/apiClient';

// Types
export interface AIMessage {
  id: string;
  sender: 'user' | 'realito';
  content: string;
  actions?: any[];
  createdAt: string;
}

export interface AIConversation {
  id: string;
  userId?: string;
  mode: string;
  createdAt: string;
  updatedAt: string;
  messages?: AIMessage[];
}

export interface AIInfo {
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  knowledgeBase: {
    places: number;
    routes: number;
    events: number;
    nearby: number;
  };
}

// Hooks
export function useAIInfo() {
  return useQuery({
    queryKey: queryKeys.ai.info(),
    queryFn: () => apiClient.get<AIInfo>('/ai/info'),
    staleTime: Infinity, // AI info rarely changes
  });
}

export function useAIChat() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ message, history }: { message: string; history?: any[] }) =>
      apiClient.post<{ data: { message: string; actions?: any[]; context?: any } }>('/ai/chat', {
        message,
        history,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ai.sessions() });
    },
  });
}

export function useAIQuery() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ message, sessionId, context }: { 
      message: string; 
      sessionId?: string; 
      context?: Record<string, any> 
    }) =>
      apiClient.post<{ 
        data: { 
          sessionId: string; 
          message: AIMessage; 
          actions?: any[]; 
          knowledgeBase?: any 
        } 
      }>('/ai/query', {
        message,
        sessionId,
        context,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ai.sessions() });
    },
  });
}

export function useAIConversations() {
  return useQuery({
    queryKey: queryKeys.ai.sessions(),
    queryFn: () => apiClient.get<AIConversation[]>('/ai/sessions'),
  });
}

export function useAIConversation(id: string) {
  return useQuery({
    queryKey: queryKeys.ai.session(id),
    queryFn: () => apiClient.get<AIConversation>(`/ai/sessions/${id}`),
    enabled: !!id,
  });
}

export function useDeleteAIConversation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(`/ai/sessions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ai.sessions() });
    },
  });
}

// Export chat component
export { default as RealitoChat } from './RealitoChat';
