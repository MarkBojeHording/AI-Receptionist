// pages/api/twilio/sms.js
import { MessagingResponse } from 'twilio/lib/twiml/MessagingResponse';
import { createClient } from '@supabase/supabase-js';

// Use your admin client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

// Helper to verify request came from Twilio (optional for now)
import twilio from 'twilio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  try {
    const twilioSignature = req.headers['x-twilio-signature'];

    // (Optional) Validate signature — requires your Twilio Auth Token
    // const isValid = twilio.validateRequest(
    //   process.env.TWILIO_AUTH_TOKEN,
    //   twilioSignature,
    //   `${process.env.NEXT_PUBLIC_BASE_URL}/api/twilio/sms`,
    //   req.body
    // );
    // if (!isValid) return res.status(403).send('Invalid signature');

    // Extract SMS fields
    const { From, To, Body } = req.body;

    // Insert into Supabase
    const { data, error } = await supabase
      .from('conversations')
      .insert([
        {
          from_number: From,
          to_number: To,
          message: Body,
          direction: 'inbound',
          channel: 'sms',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).send('Database insert failed');
    }

    // Build a TwiML response (reply to sender)
    const twiml = new MessagingResponse();
    twiml.message('Thanks! Your message was received.');

    res.setHeader('Content-Type', 'text/xml');
    return res.status(200).send(twiml.toString());
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).send('Server error');
  }
}
