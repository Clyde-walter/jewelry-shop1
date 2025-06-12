
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ujwvvmyjjstzemmijxnl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqd3Z2bXlqanN0emVtbWlqeG5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4Nzk1OTUsImV4cCI6MjA2MjQ1NTU5NX0.VcNNwtj_1g5FrMcuokUf5VkILQFfkgmDmr2hSQZ1q6w'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})
