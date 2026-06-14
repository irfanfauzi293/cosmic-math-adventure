import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

async function run() {
  const { data, error } = await supabase.storage.listBuckets()
  if (error) console.error(error)
  else console.log(data)
}
run()
