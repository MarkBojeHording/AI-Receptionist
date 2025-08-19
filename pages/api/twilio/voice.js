// pages/api/twilio/voice.js
import twilio from 'twilio';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  try {
    const { From, To, CallSid } = req.body;

    // Insert call record
    const { error } = await supabase.from('conversations').insert([
      {
        from_number: From,
        to_number: To,
        message: `Incoming call: ${CallSid}`,
        direction: 'inbound',
        channel: 'voice',
      },
    ]);

    if (error) console.error('Supabase insert error:', error);

    // Respond with TwiML (simple greeting for now)
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('Hello! Thanks for calling. We will get back to you soon.');

    res.setHeader('Content-Type', 'text/xml');
    return res.status(200).send(twiml.toString());
  } catch (err) {
    console.error('Voice handler error:', err);
    return res.status(500).send('Server error');
  }
}
