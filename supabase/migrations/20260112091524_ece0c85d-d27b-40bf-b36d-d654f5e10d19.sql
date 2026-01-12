-- Create brands table
CREATE TABLE public.brands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  price NUMERIC NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shopkeeper_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'packed', 'delivered')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  brand_id UUID NOT NULL,
  brand_name TEXT NOT NULL,
  category_id UUID NOT NULL,
  category_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1
);

-- Enable RLS on all tables (but allow public access since no auth)
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create public access policies (since this is a personal catalog app without auth)
CREATE POLICY "Allow public read access on brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on brands" ON public.brands FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on brands" ON public.brands FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on brands" ON public.brands FOR DELETE USING (true);

CREATE POLICY "Allow public read access on categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on categories" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on categories" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on categories" ON public.categories FOR DELETE USING (true);

CREATE POLICY "Allow public read access on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on products" ON public.products FOR DELETE USING (true);

CREATE POLICY "Allow public read access on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on orders" ON public.orders FOR DELETE USING (true);

CREATE POLICY "Allow public read access on order_items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on order_items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on order_items" ON public.order_items FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on order_items" ON public.order_items FOR DELETE USING (true);