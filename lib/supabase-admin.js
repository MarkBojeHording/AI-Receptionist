import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE');
}

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE,
  { auth: { persistSession: false } }
);

export async function logMessage({ from, to, message, direction, channel = 'sms', conversationId = null }) {
  const { data, error } = await supabaseAdmin
    .from('conversations')
    .insert({
      from_number: from,
      to_number: to,
      message,
      direction,            // 'inbound' | 'outbound'
      channel,              // 'sms' | 'voice' | 'web'
      conversation_id: conversationId
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
