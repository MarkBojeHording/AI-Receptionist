import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  console.log("🔑 OpenAI Key Loaded:", !!process.env.OPENAI_API_KEY);

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: message }],
      max_tokens: 200,
    });

    const aiReply = completion.choices[0].message.content;

    return res.status(200).json({
      success: true,
      reply: aiReply,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
