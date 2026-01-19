import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

type AuditAction =
  | "upload"
  | "generation"
  | "export"
  | "template_create"
  | "template_update"
  | "template_delete";

interface LogOptions {
  agencyId?: string | null;
  brandAccountId?: string | null;
  details?: Record<string, Json>;
}

export const logAudit = async (action: AuditAction, options: LogOptions = {}) => {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return;

  await supabase.from("audit_logs").insert([{
    user_id: userId,
    agency_id: options.agencyId ?? null,
    brand_account_id: options.brandAccountId ?? null,
    action,
    details: (options.details ?? {}) as Json,
  }]);
};

export const createNotification = async (
  type: "generation" | "export" | "upload",
  title: string,
  message: string,
  brandAccountId?: string | null
) => {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return;

  await supabase.from("notifications").insert([{
    user_id: userId,
    brand_account_id: brandAccountId ?? null,
    type,
    title,
    message,
  }]);
};
