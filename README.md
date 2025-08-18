# AI Receptionist

Minimal Next.js project for an AI Receptionist that can be deployed to Vercel immediately.

## Project Structure

```
AI-Receptionist/
├── pages/
│   ├── index.js          # Home page
│   ├── _app.js           # App wrapper
│   └── api/
│       └── chat.js       # Chat API endpoint
├── styles/
│   └── globals.css       # Global styles
├── package.json          # Dependencies
└── .env                  # Environment variables (you provide)
```

## Environment Variables

Create a `.env` file with your API keys:

```
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
OPENAI_API_KEY=your_openai_api_key
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id
```

## Local Development

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

The project will build successfully on Vercel with no additional configuration needed.
