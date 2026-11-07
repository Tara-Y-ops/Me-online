/// <reference types="vite/client" />

// Environment variables read by the app. See .env.example.
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
}
