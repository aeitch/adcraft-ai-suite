-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'agency_owner', 'agency_member', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create agencies table (for multi-tenant agency management)
CREATE TABLE public.agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create brand_accounts table
CREATE TABLE public.brand_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  logo_initial TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'paused')),
  rag_status TEXT NOT NULL DEFAULT 'offline' CHECK (rag_status IN ('connected', 'syncing', 'offline')),
  ads_generated INTEGER NOT NULL DEFAULT 0,
  performance_lift DECIMAL(5,2) NOT NULL DEFAULT 0,
  templates_indexed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create brand_files table (for uploaded brand history files)
CREATE TABLE public.brand_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_account_id UUID REFERENCES public.brand_accounts(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  indexed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create generated_ads table
CREATE TABLE public.generated_ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  brand_account_id UUID REFERENCES public.brand_accounts(id) ON DELETE SET NULL,
  platform TEXT NOT NULL CHECK (platform IN ('linkedin', 'meta', 'google')),
  prompt TEXT NOT NULL,
  headline TEXT NOT NULL,
  body_text TEXT NOT NULL,
  call_to_action TEXT NOT NULL,
  agentic_mode BOOLEAN NOT NULL DEFAULT false,
  template_match_score DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_ads ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_agencies_updated_at BEFORE UPDATE ON public.agencies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_brand_accounts_updated_at BEFORE UPDATE ON public.brand_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for agencies
CREATE POLICY "Agency owners can manage their agencies" ON public.agencies FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Users can view agencies they belong to" ON public.agencies FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.brand_accounts ba
    JOIN public.generated_ads ga ON ga.brand_account_id = ba.id
    WHERE ba.agency_id = agencies.id AND ga.user_id = auth.uid()
  )
  OR owner_id = auth.uid()
);

-- RLS Policies for brand_accounts
CREATE POLICY "Agency owners can manage brand accounts" ON public.brand_accounts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.agencies WHERE id = brand_accounts.agency_id AND owner_id = auth.uid())
);
CREATE POLICY "Users can view brand accounts in their agency" ON public.brand_accounts FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.agencies WHERE id = brand_accounts.agency_id AND owner_id = auth.uid())
);

-- RLS Policies for brand_files
CREATE POLICY "Agency owners can manage brand files" ON public.brand_files FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.brand_accounts ba
    JOIN public.agencies a ON a.id = ba.agency_id
    WHERE ba.id = brand_files.brand_account_id AND a.owner_id = auth.uid()
  )
);

-- RLS Policies for generated_ads
CREATE POLICY "Users can view their own generated ads" ON public.generated_ads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own generated ads" ON public.generated_ads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own generated ads" ON public.generated_ads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own generated ads" ON public.generated_ads FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for brand files
INSERT INTO storage.buckets (id, name, public) VALUES ('brand-files', 'brand-files', false);

-- Storage policies for brand-files bucket
CREATE POLICY "Authenticated users can upload brand files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'brand-files');
CREATE POLICY "Users can view their uploaded brand files" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'brand-files');
CREATE POLICY "Users can delete their uploaded brand files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'brand-files');