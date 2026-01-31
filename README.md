<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Tyw_6qNRpTnqd4Sh6ZNjtNCqzek3NFc6

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies: `npm install`
2. Configure environment: copy [.env.local.example](.env.local.example) to `.env.local` and set:
   - `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (from your Supabase project)
   - `VITE_API_KEY` (Gemini API key for try-on)
3. Run the app: `npm run dev`

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com) and get **Project URL** and **anon public** key from Settings → API.
2. In the Supabase Dashboard, open **SQL Editor** and run the migration: [supabase/migrations/001_initial.sql](supabase/migrations/001_initial.sql). This creates:
   - Tables: `profiles`, `products`, `credit_transactions`
   - RLS policies and a trigger that creates a profile when a user signs up (with 5 credits; `admin@match.com` gets `is_admin = true`)
   - Storage bucket `product-images` and its policies
3. (Optional) Create an admin user: sign up with email `admin@match.com` and a password; the trigger will set `is_admin = true` for that email.
4. Put `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`.
