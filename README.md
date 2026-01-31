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

**📖 Para una guía completa paso a paso, consulta [SUPABASE_SETUP.md](SUPABASE_SETUP.md)**

### Quick Setup

1. Create a project at [supabase.com](https://supabase.com) and get **Project URL** and **anon public** key from Settings → API.
2. **Enable Email provider** and **disable email confirmation** in Authentication → Providers → Email.
3. In the Supabase Dashboard, open **SQL Editor** and run: [supabase/setup_complete.sql](supabase/setup_complete.sql)
   - This creates all tables, RLS policies, and storage configurations
   - Includes the critical "Users can insert own profile on signup" policy
4. Verify setup by running: [supabase/verify_setup.sql](supabase/verify_setup.sql)
5. Create storage bucket `product-images` (mark as public) in Storage.
6. Put `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`.

**Note**: The app uses client-side profile creation (no database trigger). Make sure email confirmation is **disabled** for immediate login after signup.
