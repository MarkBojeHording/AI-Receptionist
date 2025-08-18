export default function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { message } = req.body

    // Basic validation
    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    // Placeholder response for AI integration
    const response = {
      message: `Received: ${message}`,
      timestamp: new Date().toISOString(),
      status: 'success'
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Chat API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
