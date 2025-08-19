// Simple direct Airtable test
import Airtable from 'airtable';

export default async function handler(req, res) {
  try {
    console.log('=== SIMPLE AIRTABLE TEST ===');
    
    // Check environment variables
    if (!process.env.AIRTABLE_API_KEY) {
      throw new Error('AIRTABLE_API_KEY missing');
    }
    if (!process.env.AIRTABLE_BASE_ID) {
      throw new Error('AIRTABLE_BASE_ID missing');
    }
    
    console.log('API Key exists:', !!process.env.AIRTABLE_API_KEY);
    console.log('Base ID:', process.env.AIRTABLE_BASE_ID);
    
    // Direct Airtable call
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
      process.env.AIRTABLE_BASE_ID
    );
    
    const table = base('Calls');
    
    const result = await table.create([
      {
        fields: {
          From: '+15551234567',
          To: '+15559876543',
          Body: 'Simple test - ' + new Date().toISOString(),
          Channel: 'simple-test'
        }
      }
    ]);
    
    console.log('Success! Result:', result);
    
    res.status(200).json({
      success: true,
      message: 'Record created',
      result: result
    });
    
  } catch (error) {
    console.error('Simple test failed:', error.message);
    console.error('Full error:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      fullError: error.toString()
    });
  }
}
