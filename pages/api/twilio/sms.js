// --- /pages/api/twilio/sms.js ---
// Handles incoming SMS messages. Logs to Airtable and generates an AI response.

import twilio from 'twilio';
import OpenAI from 'openai';
import { logSmsMessage } from '../../../lib/airtable';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    // Generate AI response using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a friendly and polite receptionist for a business. Your name is Amelia. When a new customer texts you, you greet them and ask for their name, phone number, and a brief message about why they are contacting you. Keep your responses short and to the point. Do not mention that you are an AI or bot. If the customer seems to be leaving their information, thank them and say that the appropriate person will get back to them. Do not ask for their information again if they have already provided it.'
        },
        {
          role: 'user',
          content: Body
        }
      ],
      max_tokens: 150,
    });

    const aiResponse = completion.choices[0].message.content;

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
