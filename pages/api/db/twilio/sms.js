// --- /pages/api/twilio/sms.js ---
// This file handles incoming SMS messages from Twilio.
// It logs the message to Airtable and generates an AI response.

import twilio from 'twilio';
import { logSmsMessage } from '../../lib/airtable';
import { generateGeminiResponse } from '../../lib/gemini';

export default async function handler(req, res) {
  // Ensure the request is a POST request, as required by Twilio webhooks.
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { From, To, Body } = req.body;

    // Log the incoming message to Airtable asynchronously.
    // We use .catch() to handle potential errors without blocking the response.
    logSmsMessage({
      from: From,
      to: To,
      body: Body,
      channel: 'sms',
    }).catch(console.error);

    // Get the AI's response using the Gemini function we created.
    const aiResponse = await generateGeminiResponse(Body);

    // Build the TwiML response. TwiML is Twilio's XML-based language for telling
    // it what to do, in this case, sending a reply message.
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(aiResponse);

    // Set the Content-Type header to 'text/xml' as Twilio expects.
    res.setHeader('Content-Type', 'text/xml');

    // Send the TwiML response back to Twilio.
    return res.status(200).send(twiml.toString());
  } catch (err) {
    console.error('Handler error:', err);
    // If there's an error, send a graceful message back to the user.
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message("Sorry, I'm having some technical issues right now. Please try again later.");
    res.setHeader('Content-Type', 'text/xml');
    return res.status(500).send(twiml.toString());
  }
}
