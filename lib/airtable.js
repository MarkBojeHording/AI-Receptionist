// --- /lib/airtable.js ---
// This file is a helper library for all Airtable API interactions.
// It uses environment variables to connect to your base.

import Airtable from 'airtable';

// Initialize Airtable with your API key and base ID.
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

/**
 * Logs an incoming SMS message to the Airtable base.
 * @param {object} messageData - The message data to log.
 * @param {string} messageData.from - The sender's phone number.
 * @param {string} messageData.to - The recipient's phone number.
 * @param {string} messageData.body - The message body.
 * @param {string} messageData.channel - The channel (e.g., 'sms').
 */
export async function logSmsMessage(messageData) {
  try {
    const table = base('Table 1');
    await table.create([
      {
        fields: {
          From: messageData.from,
          To: messageData.to,
          Body: messageData.body,
          Channel: messageData.channel,
        },
      },
    ]);
  } catch (err) {
    console.error('Failed to log message to Airtable:', err);
  }
}

/**
 * Logs a voice call with a transcribed message to the Airtable base.
 * @param {object} messageData - The message data to log.
 * @param {string} messageData.from - The caller's phone number.
 * @param {string} messageData.to - The recipient's phone number.
 * @param {string} messageData.body - The transcribed message.
 * @param {string} messageData.channel - The channel (e.g., 'voice').
 */
export async function logVoiceCall(messageData) {
  try {
    const table = base('Table 1');
    await table.create([
      {
        fields: {
          From: messageData.from,
          To: messageData.to,
          Body: messageData.body,
          Channel: messageData.channel,
        },
      },
    ]);
  } catch (err) {
    console.error('Failed to log voice call to Airtable:', err);
  }
}
