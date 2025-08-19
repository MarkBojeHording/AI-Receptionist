import { logMessage } from '../../../lib/supabase-admin';

export default async function handler(req, res) {
  try {
    const row = await logMessage({
      from: '+10001112222',
      to: '+19998887777',
      message: 'Hello from test route',
      direction: 'inbound',
      channel: 'web'
    });
    res.status(200).json({ ok: true, row });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
