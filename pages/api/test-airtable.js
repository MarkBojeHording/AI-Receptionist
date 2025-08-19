// Test endpoint for Airtable connection
import { logSmsMessage } from '../../lib/airtable';

export default async function handler(req, res) {
  try {
    console.log('Testing Airtable connection...');
    console.log('AIRTABLE_API_KEY exists:', !!process.env.AIRTABLE_API_KEY);
    console.log('AIRTABLE_BASE_ID:', process.env.AIRTABLE_BASE_ID);
    
    const testData = {
      from: '+15551234567',
      to: '+15559876543',
      body: 'Test message from API',
      channel: 'test'
    };
    
    console.log('Attempting to log test data:', testData);
    
    await logSmsMessage(testData);
    
    console.log('Airtable test successful!');
    
    res.status(200).json({ 
      success: true, 
      message: 'Airtable connection working',
      data: testData
    });
    
  } catch (error) {
    console.error('Airtable test failed:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    });
  }
}
