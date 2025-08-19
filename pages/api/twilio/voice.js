// --- /pages/api/twilio/voice.js ---
// This file handles incoming voice calls from Twilio.
// It uses TwiML to greet the caller, record their message, and log the details to Airtable.

import twilio from 'twilio';
import { logVoiceCall } from '../../lib/airtable'; // Corrected path assumption for /pages/api/twilio/

export default async function handler(req, res) {
  // Ensure the request is a POST request.
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { From, To, RecordingUrl, Caller } = req.body;

    // Create a new TwiML response.
    const twiml = new twilio.twiml.VoiceResponse();

    // Use a <Say> verb to greet the caller.
    twiml.say('Hello, thank you for calling. Please leave a message after the tone.');

    // Use a <Record> verb to record the user's message.
    // The "transcribe" attribute will tell Twilio to transcribe the recording.
    // "transcribeCallback" will send the transcription to a separate endpoint.
    twiml.record({
      transcribe: true,
      transcribeCallback: '/api/twilio/voice_transcription',
      maxLength: 30, // Limit the recording to 30 seconds to prevent long calls.
      finishOnKey: '#', // The user can press the '#' key to end the recording early.
    });

    // Say goodbye after the recording.
    twiml.say('Thank you for your message. Goodbye.');

    res.setHeader('Content-Type', 'text/xml');
    return res.status(200).send(twiml.toString());
  } catch (err) {
    console.error('Voice handler error:', err);
    // Send a graceful error message.
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say('Sorry, there was an error processing your call.');
    res.setHeader('Content-Type', 'text/xml');
    return res.status(500).send(twiml.toString());
  }
}
