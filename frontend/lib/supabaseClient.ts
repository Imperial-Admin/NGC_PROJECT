import { createClient } from '@supabase/supabase-js'

// שימוש בערכי ברירת מחדל זמניים למניעת קריסה בזמן הבנייה בלבד
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
// Force refresh build for PRO