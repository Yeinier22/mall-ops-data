import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null | undefined = undefined;

export function getSupabase(): SupabaseClient | null {
	if (cached !== undefined) return cached;
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !key) {
		cached = null;
		return cached;
	}
	cached = createClient(url, key);
	return cached;
}
