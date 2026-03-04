const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Helper function to get auth token
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('rdm_token');
  }
  return null;
};

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Request failed' } }));
    throw new Error(error.error?.message || 'Request failed');
  }

  return response.json();
}

// Auth API
export const authApi = {
  signup: (data: { name: string; email: string; password: string; role?: string }) =>
    apiRequest<{ success: boolean; data: { user: any; token: string } }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiRequest<{ success: boolean; data: { user: any; token: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiRequest<{ success: boolean }>('/auth/logout', {
      method: 'POST',
    }),

  me: () =>
    apiRequest<{ success: boolean; data: any }>('/auth/me'),

  updateProfile: (data: { name?: string; avatarUrl?: string }) =>
    apiRequest<{ success: boolean; data: any }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiRequest<{ success: boolean }>('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Businesses API
export const businessesApi = {
  getAll: (params?: { category?: string; isPremium?: boolean; search?: string; limit?: number; offset?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.isPremium) searchParams.set('isPremium', 'true');
    if (params?.search) searchParams.set('search', params.search);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    const query = searchParams.toString();
    return apiRequest<{ success: boolean; data: any[]; pagination: any }>(`/businesses${query ? `?${query}` : ''}`);
  },

  getById: (id: string) =>
    apiRequest<{ success: boolean; data: any }>(`/businesses/${id}`),

  getCategories: () =>
    apiRequest<{ success: boolean; data: string[] }>('/businesses/categories'),

  create: (data: any) =>
    apiRequest<{ success: boolean; data: any }>('/businesses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest<{ success: boolean; data: any }>(`/businesses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/businesses/${id}`, {
      method: 'DELETE',
    }),
};

// Markers/Places API
export const markersApi = {
  getAll: (params?: { category?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.search) searchParams.set('search', params.search);
    const query = searchParams.toString();
    return apiRequest<{ success: boolean; data: any[] }>(`/markers${query ? `?${query}` : ''}`);
  },

  getById: (id: string) =>
    apiRequest<{ success: boolean; data: any }>(`/markers/${id}`),

  getCategories: () =>
    apiRequest<{ success: boolean; data: string[] }>('/markers/categories'),
};

// Events API
export const eventsApi = {
  getAll: (params?: { isFeatured?: boolean; startDate?: string; endDate?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.isFeatured) searchParams.set('isFeatured', 'true');
    if (params?.startDate) searchParams.set('startDate', params.startDate);
    if (params?.endDate) searchParams.set('endDate', params.endDate);
    if (params?.search) searchParams.set('search', params.search);
    const query = searchParams.toString();
    return apiRequest<{ success: boolean; data: any[] }>(`/events${query ? `?${query}` : ''}`);
  },

  getFeatured: () =>
    apiRequest<{ success: boolean; data: any[] }>('/events/featured'),

  getUpcoming: () =>
    apiRequest<{ success: boolean; data: any[] }>('/events/upcoming'),

  getById: (id: string) =>
    apiRequest<{ success: boolean; data: any }>(`/events/${id}`),

  create: (data: any) =>
    apiRequest<{ success: boolean; data: any }>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Routes API
export const routesApi = {
  getAll: (params?: { difficulty?: string; isNightRoute?: boolean; isFamilyFriendly?: boolean; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.difficulty) searchParams.set('difficulty', params.difficulty);
    if (params?.isNightRoute) searchParams.set('isNightRoute', 'true');
    if (params?.isFamilyFriendly) searchParams.set('isFamilyFriendly', 'true');
    if (params?.search) searchParams.set('search', params.search);
    const query = searchParams.toString();
    return apiRequest<{ success: boolean; data: any[] }>(`/routes${query ? `?${query}` : ''}`);
  },

  getFeatured: () =>
    apiRequest<{ success: boolean; data: any[] }>('/routes/featured'),

  getById: (id: string) =>
    apiRequest<{ success: boolean; data: any }>(`/routes/${id}`),
};

// Posts API
export const postsApi = {
  getAll: (params?: { placeName?: string; search?: string; limit?: number; offset?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.placeName) searchParams.set('placeName', params.placeName);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    const query = searchParams.toString();
    return apiRequest<{ success: boolean; data: any[] }>(`/posts${query ? `?${query}` : ''}`);
  },

  getById: (id: string) =>
    apiRequest<{ success: boolean; data: any }>(`/posts/${id}`),

  create: (data: { placeName: string; content: string; imageUrl?: string }) =>
    apiRequest<{ success: boolean; data: any }>('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: { content?: string; imageUrl?: string }) =>
    apiRequest<{ success: boolean; data: any }>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/posts/${id}`, {
      method: 'DELETE',
    }),

  like: (id: string) =>
    apiRequest<{ success: boolean; isLiked: boolean }>(`/posts/${id}/like`, {
      method: 'POST',
    }),

  comment: (id: string, content: string) =>
    apiRequest<{ success: boolean; data: any }>(`/posts/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
};

// Newsletter API
export const newsletterApi = {
  subscribe: (data: { email: string; source?: string; name?: string }) =>
    apiRequest<{ success: boolean; message: string }>('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  unsubscribe: (email: string) =>
    apiRequest<{ success: boolean }>('/newsletter/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  check: (email: string) =>
    apiRequest<{ success: boolean; data: { subscribed: boolean } }>(`/newsletter/check?email=${encodeURIComponent(email)}`),
};

// Payments/Tips API
export const paymentsApi = {
  createCheckoutSession: (data: { toType: 'app' | 'business'; toBusinessId?: string; amount: number; currency?: string; message?: string }) =>
    apiRequest<{ success: boolean; data: { sessionId: string; url: string } }>('/tips/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  createBusinessUpgradeSession: (businessId: string) =>
    apiRequest<{ success: boolean; data: { sessionId: string; url: string } }>('/tips/create-business-upgrade-session', {
      method: 'POST',
      body: JSON.stringify({ businessId }),
    }),
};

// AI/Realito API
export const aiApi = {
  query: (data: { message: string; sessionId?: string; context?: Record<string, any> }) =>
    apiRequest<{ success: boolean; data: { sessionId: string; message: any; actions?: any[] } }>('/ai/query', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getSessions: () =>
    apiRequest<{ success: boolean; data: any[] }>('/ai/sessions'),

  getSession: (id: string) =>
    apiRequest<{ success: boolean; data: any }>(`/ai/sessions/${id}`),

  deleteSession: (id: string) =>
    apiRequest<{ success: boolean }>(`/ai/sessions/${id}`, {
      method: 'DELETE',
    }),
};

// Analytics API
export const analyticsApi = {
  trackEvent: (eventType: string, metadata?: Record<string, any>) =>
    apiRequest<{ success: boolean }>('/analytics/events', {
      method: 'POST',
      body: JSON.stringify({ eventType, metadata }),
    }),
};

export default {
  auth: authApi,
  businesses: businessesApi,
  markers: markersApi,
  events: eventsApi,
  routes: routesApi,
  posts: postsApi,
  newsletter: newsletterApi,
  payments: paymentsApi,
  ai: aiApi,
  analytics: analyticsApi,
};
