
-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories
-- Users can view all categories
CREATE POLICY "Anyone can view categories" 
  ON public.categories FOR SELECT USING (true);

-- Only authenticated users can insert categories
CREATE POLICY "Authenticated users can insert categories" 
  ON public.categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update their own categories
CREATE POLICY "Authenticated users can update their own categories" 
  ON public.categories FOR UPDATE USING (auth.role() = 'authenticated');

-- Only authenticated users can delete their own categories
CREATE POLICY "Authenticated users can delete their own categories" 
  ON public.categories FOR DELETE USING (auth.role() = 'authenticated');

-- Add reference to categories in loans table (if loans table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'loans') THEN
    ALTER TABLE public.loans ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id);
  END IF;
END
$$;

-- Create an index on the categories name for faster lookups
CREATE INDEX IF NOT EXISTS idx_categories_name ON public.categories(name);
