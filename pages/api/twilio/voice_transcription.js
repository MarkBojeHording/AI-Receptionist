// --- /pages/api/twilio/voice_transcription.js ---
// This file handles the transcription of a voice message from Twilio.
// It logs the transcribed text to Airtable.

import twilio from 'twilio';
import { logVoiceCall } from '../../../lib/airtable';

export default async function handler(req, res) {
  // Ensure the request is a POST request from Twilio.
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { From, To, TranscriptionText } = req.body;

    // Log the transcribed message to Airtable asynchronously.
    // The .catch() block will now log the error to the console.
    logVoiceCall({
      from: From,
      to: To,
      body: TranscriptionText,
      channel: 'voice',
    }).catch(err => {
      console.error('Failed to log voice call to Airtable:', err);
    });

    // Send a minimal TwiML response to acknowledge receipt.
    const twiml = new twilio.twiml.VoiceResponse();
    res.setHeader('Content-Type', 'text/xml');
    return res.status(200).send(twiml.toString());

  } catch (err) {
    console.error('Transcription handler error:', err);
    // Send an empty TwiML response on error.
    res.setHeader('Content-Type', 'text/xml');
    return res.status(500).send(new twilio.twiml.VoiceResponse().toString());
  }
}
