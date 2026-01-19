-- Brand preferences table for persisting selected brand
CREATE TABLE public.brand_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  brand_account_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.brand_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own preferences"
ON public.brand_preferences FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert their own preferences"
ON public.brand_preferences FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
ON public.brand_preferences FOR UPDATE
USING (auth.uid() = user_id);

CREATE TRIGGER update_brand_preferences_updated_at
BEFORE UPDATE ON public.brand_preferences
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Templates table with tagging
CREATE TABLE public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_account_id UUID NOT NULL,
  name TEXT NOT NULL,
  platform TEXT NOT NULL,
  headline TEXT,
  body_text TEXT,
  call_to_action TEXT,
  tags TEXT[] DEFAULT '{}',
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view templates for their agency brands"
ON public.templates FOR SELECT
USING (EXISTS (
  SELECT 1 FROM brand_accounts ba
  JOIN agencies a ON a.id = ba.agency_id
  WHERE ba.id = templates.brand_account_id AND a.owner_id = auth.uid()
));

CREATE POLICY "Users can create templates for their agency brands"
ON public.templates FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM brand_accounts ba
  JOIN agencies a ON a.id = ba.agency_id
  WHERE ba.id = templates.brand_account_id AND a.owner_id = auth.uid()
) AND auth.uid() = created_by);

CREATE POLICY "Users can update templates for their agency brands"
ON public.templates FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM brand_accounts ba
  JOIN agencies a ON a.id = ba.agency_id
  WHERE ba.id = templates.brand_account_id AND a.owner_id = auth.uid()
));

CREATE POLICY "Users can delete templates for their agency brands"
ON public.templates FOR DELETE
USING (EXISTS (
  SELECT 1 FROM brand_accounts ba
  JOIN agencies a ON a.id = ba.agency_id
  WHERE ba.id = templates.brand_account_id AND a.owner_id = auth.uid()
));

CREATE TRIGGER update_templates_updated_at
BEFORE UPDATE ON public.templates
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  brand_account_id UUID,
  type TEXT NOT NULL, -- 'generation', 'export', 'upload'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
ON public.notifications FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications"
ON public.notifications FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Audit logs table for compliance
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  agency_id UUID,
  brand_account_id UUID,
  action TEXT NOT NULL, -- 'upload', 'generation', 'export', 'template_create', 'template_update', 'template_delete'
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agency owners can view audit logs for their agencies"
ON public.audit_logs FOR SELECT
USING (EXISTS (
  SELECT 1 FROM agencies a
  WHERE a.id = audit_logs.agency_id AND a.owner_id = auth.uid()
) OR (agency_id IS NULL AND auth.uid() = user_id));

CREATE POLICY "Users can insert their own audit logs"
ON public.audit_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_audit_logs_agency ON public.audit_logs(agency_id, created_at DESC);
CREATE INDEX idx_audit_logs_brand ON public.audit_logs(brand_account_id, created_at DESC);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, read, created_at DESC);