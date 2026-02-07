import { createClient } from '@supabase/supabase-js'

// שימוש בכתובת ברירת מחדל רק כדי למנוע קריסה בזמן הבנייה בענן
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)