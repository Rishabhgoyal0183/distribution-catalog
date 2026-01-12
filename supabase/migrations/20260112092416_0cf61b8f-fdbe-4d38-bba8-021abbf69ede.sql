-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Allow public delete access on brands" ON public.brands;
DROP POLICY IF EXISTS "Allow public insert access on brands" ON public.brands;
DROP POLICY IF EXISTS "Allow public update access on brands" ON public.brands;

DROP POLICY IF EXISTS "Allow public delete access on categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public insert access on categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public update access on categories" ON public.categories;

DROP POLICY IF EXISTS "Allow public delete access on products" ON public.products;
DROP POLICY IF EXISTS "Allow public insert access on products" ON public.products;
DROP POLICY IF EXISTS "Allow public update access on products" ON public.products;

DROP POLICY IF EXISTS "Allow public read access on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public delete access on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public insert access on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public update access on orders" ON public.orders;

DROP POLICY IF EXISTS "Allow public read access on order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow public delete access on order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow public insert access on order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow public update access on order_items" ON public.order_items;

-- Brands: public read, authenticated write
CREATE POLICY "Authenticated users can insert brands" ON public.brands
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update brands" ON public.brands
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete brands" ON public.brands
FOR DELETE TO authenticated USING (true);

-- Categories: public read, authenticated write
CREATE POLICY "Authenticated users can insert categories" ON public.categories
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories" ON public.categories
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete categories" ON public.categories
FOR DELETE TO authenticated USING (true);

-- Products: public read, authenticated write
CREATE POLICY "Authenticated users can insert products" ON public.products
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update products" ON public.products
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete products" ON public.products
FOR DELETE TO authenticated USING (true);

-- Orders: authenticated only (read/write)
CREATE POLICY "Authenticated users can read orders" ON public.orders
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert orders" ON public.orders
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update orders" ON public.orders
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete orders" ON public.orders
FOR DELETE TO authenticated USING (true);

-- Order items: authenticated only (read/write)
CREATE POLICY "Authenticated users can read order_items" ON public.order_items
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert order_items" ON public.order_items
FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update order_items" ON public.order_items
FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete order_items" ON public.order_items
FOR DELETE TO authenticated USING (true);