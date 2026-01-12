-- Drop the authenticated-only policies
DROP POLICY IF EXISTS "Authenticated users can insert brands" ON public.brands;
DROP POLICY IF EXISTS "Authenticated users can update brands" ON public.brands;
DROP POLICY IF EXISTS "Authenticated users can delete brands" ON public.brands;

DROP POLICY IF EXISTS "Authenticated users can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can update categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can delete categories" ON public.categories;

DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;

DROP POLICY IF EXISTS "Authenticated users can read orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can delete orders" ON public.orders;

DROP POLICY IF EXISTS "Authenticated users can read order_items" ON public.order_items;
DROP POLICY IF EXISTS "Authenticated users can insert order_items" ON public.order_items;
DROP POLICY IF EXISTS "Authenticated users can update order_items" ON public.order_items;
DROP POLICY IF EXISTS "Authenticated users can delete order_items" ON public.order_items;

-- Create policies that allow all operations (app-level auth handles security)
CREATE POLICY "Allow insert brands" ON public.brands FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update brands" ON public.brands FOR UPDATE USING (true);
CREATE POLICY "Allow delete brands" ON public.brands FOR DELETE USING (true);

CREATE POLICY "Allow insert categories" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update categories" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "Allow delete categories" ON public.categories FOR DELETE USING (true);

CREATE POLICY "Allow insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow delete products" ON public.products FOR DELETE USING (true);

CREATE POLICY "Allow read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Allow delete orders" ON public.orders FOR DELETE USING (true);

CREATE POLICY "Allow read order_items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Allow insert order_items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update order_items" ON public.order_items FOR UPDATE USING (true);
CREATE POLICY "Allow delete order_items" ON public.order_items FOR DELETE USING (true);