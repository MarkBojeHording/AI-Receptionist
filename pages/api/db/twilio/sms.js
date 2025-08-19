// --- /pages/api/db/twilio/sms.js ---
// This file handles incoming SMS messages from Twilio.
// It logs the message to Airtable and generates an AI response.

import twilio from 'twilio';
import { logSmsMessage } from '../../../lib/airtable';
import { generateGeminiResponse } from '../../../lib/gemini';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { From, To, Body } = req.body;

    logSmsMessage({
      from: From,
      to: To,
      body: Body,
      channel: 'sms',
    }).catch(console.error);

    const aiResponse = await generateGeminiResponse(Body);

    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(aiResponse);

    res.setHeader('Content-Type', 'text/xml');
    return res.status(200).send(twiml.toString());
  } catch (err) {
    console.error('Handler error:', err);
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message("Sorry, I'm having some technical issues right now. Please try again later.");
    res.setHeader('Content-Type', 'text/xml');
    return res.status(500).send(twiml.toString());
  }
}
