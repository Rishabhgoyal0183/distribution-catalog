-- Add brand_id column to categories table
ALTER TABLE public.categories 
ADD COLUMN brand_id uuid REFERENCES public.brands(id) ON DELETE CASCADE;

-- Create an index for better query performance
CREATE INDEX idx_categories_brand_id ON public.categories(brand_id);