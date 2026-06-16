import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yoteskdpajuzogjdnfln.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdGVza2RwYWp1em9namRuZmxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNTI0OTcsImV4cCI6MjA5NjkyODQ5N30.CJX5-dKKIbHkkV-AaGz5Nd7V2ltUtkeWt9yOC9UeJx0'

export const supabase = createClient(supabaseUrl, supabaseKey)
