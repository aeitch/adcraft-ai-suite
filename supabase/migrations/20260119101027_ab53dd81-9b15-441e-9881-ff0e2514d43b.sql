-- Fix storage policies for brand-files (qualify storage.objects.name)
DROP POLICY IF EXISTS "Brand owners can upload brand files" ON storage.objects;
DROP POLICY IF EXISTS "Brand owners can view brand files" ON storage.objects;
DROP POLICY IF EXISTS "Brand owners can delete brand files" ON storage.objects;
DROP POLICY IF EXISTS "Brand owners can update brand files" ON storage.objects;

DROP POLICY IF EXISTS "Authenticated users can upload brand files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their uploaded brand files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their uploaded brand files" ON storage.objects;

CREATE POLICY "Brand owners can upload brand files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'brand-files'
  AND EXISTS (
    SELECT 1
    FROM public.brand_accounts ba
    JOIN public.agencies a ON a.id = ba.agency_id
    WHERE a.owner_id = auth.uid()
      AND ba.id::text = (storage.foldername(storage.objects.name))[1]
  )
);

CREATE POLICY "Brand owners can view brand files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'brand-files'
  AND EXISTS (
    SELECT 1
    FROM public.brand_accounts ba
    JOIN public.agencies a ON a.id = ba.agency_id
    WHERE a.owner_id = auth.uid()
      AND ba.id::text = (storage.foldername(storage.objects.name))[1]
  )
);

CREATE POLICY "Brand owners can delete brand files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'brand-files'
  AND EXISTS (
    SELECT 1
    FROM public.brand_accounts ba
    JOIN public.agencies a ON a.id = ba.agency_id
    WHERE a.owner_id = auth.uid()
      AND ba.id::text = (storage.foldername(storage.objects.name))[1]
  )
);

CREATE POLICY "Brand owners can update brand files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'brand-files'
  AND EXISTS (
    SELECT 1
    FROM public.brand_accounts ba
    JOIN public.agencies a ON a.id = ba.agency_id
    WHERE a.owner_id = auth.uid()
      AND ba.id::text = (storage.foldername(storage.objects.name))[1]
  )
)
WITH CHECK (
  bucket_id = 'brand-files'
  AND EXISTS (
    SELECT 1
    FROM public.brand_accounts ba
    JOIN public.agencies a ON a.id = ba.agency_id
    WHERE a.owner_id = auth.uid()
      AND ba.id::text = (storage.foldername(storage.objects.name))[1]
  )
);

-- Update handle_new_user to also create a default agency + brand account
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_agency_id UUID;
  v_domain TEXT;
  v_agency_name TEXT;
  v_brand_name TEXT;
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT DO NOTHING;

  v_domain := NULLIF(split_part(NEW.email, '@', 2), '');
  v_agency_name := COALESCE(initcap(replace(split_part(COALESCE(v_domain, 'My Agency'), '.', 1), '-', ' ')), 'My Agency');
  v_brand_name := v_agency_name;

  INSERT INTO public.agencies (name, owner_id)
  VALUES (v_agency_name, NEW.id)
  RETURNING id INTO v_agency_id;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'agency_owner')
  ON CONFLICT DO NOTHING;

  INSERT INTO public.brand_accounts (
    agency_id,
    name,
    logo_initial,
    status,
    rag_status
  )
  VALUES (
    v_agency_id,
    v_brand_name,
    left(v_brand_name, 1),
    'active',
    'offline'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;