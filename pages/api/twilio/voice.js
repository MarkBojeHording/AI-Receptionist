// --- /pages/api/twilio/voice.js ---
// Handles incoming voice calls. Gathers transcription and logs to Airtable.

import twilio from 'twilio';
import { logVoiceCall } from '../../../lib/airtable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('Hello, thank you for calling. Please leave a message after the tone.');

    twiml.record({
      transcribe: true,
      transcribeCallback: '/api/twilio/voice_transcription',
      maxLength: 30,
      finishOnKey: '#',
    });

    twiml.say('Thank you for your message. Goodbye.');
    res.setHeader('Content-Type', 'text/xml');
    return res.status(200).send(twiml.toString());
  } catch (err) {
    console.error('Voice handler error:', err);
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('Sorry, there was an error processing your call.');
    res.setHeader('Content-Type', 'text/xml');
    return res.status(500).send(twiml.toString());
  }
}
