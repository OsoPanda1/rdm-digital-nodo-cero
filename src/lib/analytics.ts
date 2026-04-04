import { supabase } from "@/integrations/supabase/client";

type EventType = 
  | "page_view"
  | "map_interaction"
  | "business_view"
  | "event_view"
  | "search"
  | "chat_open"
  | "route_view";

export async function trackEvent(eventType: EventType, data?: Record<string, unknown>) {
  try {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user?.id ?? null;

    await supabase.from("analytics").insert({
      event_type: eventType,
      user_id: userId,
      data: data ? (data as any) : null,
    });
  } catch {
    // Silent fail — analytics should never break the app
  }
}
