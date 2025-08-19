// --- /lib/gemini.js ---
// This file is a helper library for all Gemini API interactions.
// Centralizing this code makes it easy to manage and reuse.

/**
 * Generates an AI-driven response using the Gemini API.
 * @param {string} incomingMessage - The user's incoming message.
 * @returns {Promise<string>} - A promise that resolves to the AI's response message.
 */
export async function generateGeminiResponse(incomingMessage) {
  // Define the system prompt that sets the AI's persona.
  // This is the core of your AI receptionist's personality.
  const systemPrompt = "You are a friendly and polite receptionist for a business. Your name is Amelia. When a new customer texts you, you greet them and ask for their name, phone number, and a brief message about why they are contacting you. Keep your responses short and to the point. Do not mention that you are an AI or bot. If the customer seems to be leaving their information, thank them and say that the appropriate person will get back to them. Do not ask for their information again if they have already provided it.";

  // Create the payload for the Gemini API call.
  const chatHistory = [
    { role: "user", parts: [{ text: systemPrompt }] },
    { role: "model", parts: [{ text: "Hello! My name is Amelia, and I'm the receptionist for this business. How can I help you today?" }] },
    { role: "user", parts: [{ text: incomingMessage }] },
  ];

  const payload = {
    contents: chatHistory,
    // Using gemini-2.5-flash-preview-05-20 as the model.
    model: "gemini-2.5-flash-preview-05-20"
  };

  const apiKey = "";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    // Check if the response and its parts are structured as expected.
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      const text = result.candidates[0].content.parts[0].text;
      return text;
    } else {
      console.error('Unexpected response structure from Gemini:', result);
      return "Sorry, I'm having trouble connecting right now. Please try again later.";
    }
  } catch (err) {
    console.error('API call to Gemini failed:', err);
    return "Sorry, I'm currently unavailable. Please try again later.";
  }
}


// --- /pages/api/twilio/sms.js (UPDATED) ---
// This is your existing file. We'll add the new logic here.
import twilio from 'twilio';
import { logSmsMessage } from '../../lib/airtable';
import { generateGeminiResponse } from '../../lib/gemini'; // Import the new function

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { From, To, Body } = req.body;

    // Log the incoming message to Airtable asynchronously.
    logSmsMessage({
      from: From,
      to: To,
      body: Body,
      channel: 'sms',
    }).catch(console.error);

    // Get the AI's response using the Gemini function.
    const aiResponse = await generateGeminiResponse(Body);

    // Build the TwiML response with the AI's message.
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(aiResponse);

    res.setHeader('Content-Type', 'text/xml');
    return res.status(200).send(twiml.toString());
  } catch (err) {
    console.error('Handler error:', err);
    // Return a graceful error message to the user.
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message("Sorry, I'm having some technical issues right now. Please try again later.");
    res.setHeader('Content-Type', 'text/xml');
    return res.status(500).send(twiml.toString());
  }
}
