import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { encode as hexEncode } from "https://deno.land/std@0.190.0/encoding/hex.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AuthRequest {
  action: "signup" | "login";
  email: string;
  password: string;
  name?: string;
}

// Simple password hashing using SHA-256 with salt
async function hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const useSalt = salt || crypto.randomUUID();
  const encoder = new TextEncoder();
  const data = encoder.encode(password + useSalt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = new Uint8Array(hashBuffer);
  const hexBytes = hexEncode(hashArray);
  const hash = new TextDecoder().decode(hexBytes);
  return { hash, salt: useSalt };
}

async function verifyPassword(password: string, storedHash: string, salt: string): Promise<boolean> {
  const { hash } = await hashPassword(password, salt);
  return hash === storedHash;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, email, password, name }: AuthRequest = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (action === "signup") {
      if (!name) {
        return new Response(
          JSON.stringify({ error: "Name is required for signup" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", email.toLowerCase().trim())
        .single();

      if (existingUser) {
        return new Response(
          JSON.stringify({ error: "Email already registered" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Hash password with SHA-256 + salt
      const { hash, salt } = await hashPassword(password);
      const passwordHash = `${salt}:${hash}`;

      // Insert new user
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          email: email.toLowerCase().trim(),
          name: name.trim(),
          password_hash: passwordHash,
        })
        .select("id, name, email, created_at")
        .single();

      if (insertError) {
        console.error("Signup error:", insertError);
        return new Response(
          JSON.stringify({ error: "Failed to create account" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate a simple session token
      const sessionToken = crypto.randomUUID();
      
      return new Response(
        JSON.stringify({ 
          user: newUser,
          token: sessionToken,
          message: "Account created successfully" 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "login") {
      // Find user by email
      const { data: user, error: findError } = await supabase
        .from("users")
        .select("id, name, email, password_hash, created_at")
        .eq("email", email.toLowerCase().trim())
        .single();

      if (findError || !user) {
        return new Response(
          JSON.stringify({ error: "Invalid email or password" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Extract salt and hash from stored password
      const [salt, storedHash] = user.password_hash.split(":");
      
      if (!salt || !storedHash) {
        return new Response(
          JSON.stringify({ error: "Invalid password format" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Verify password
      const isValid = await verifyPassword(password, storedHash, salt);

      if (!isValid) {
        return new Response(
          JSON.stringify({ error: "Invalid email or password" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate session token
      const sessionToken = crypto.randomUUID();

      // Return user without password hash
      const { password_hash, ...safeUser } = user;

      return new Response(
        JSON.stringify({ 
          user: safeUser,
          token: sessionToken,
          message: "Login successful" 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Auth error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
