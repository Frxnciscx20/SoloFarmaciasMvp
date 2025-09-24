import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kbtpsxbckhpoqiqpgcji.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtidHBzeGJja2hwb3FpcXBnY2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNzA4OTIsImV4cCI6MjA1ODk0Njg5Mn0.TTU7sbYH8-Drziz5K9aQwlr7eqRQTRJUUiSe-wlGsXE'

export const supabase = createClient(supabaseUrl, supabaseKey)
