-- Create users table for custom authentication
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow public to check credentials (for login)
CREATE POLICY "Allow public to read users for auth" ON public.users
FOR SELECT USING (true);

-- Allow public to insert new users (for signup)
CREATE POLICY "Allow public to insert users" ON public.users
FOR INSERT WITH CHECK (true);