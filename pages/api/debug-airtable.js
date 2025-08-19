// Detailed debugging endpoint for Airtable
import Airtable from 'airtable';

export default async function handler(req, res) {
  try {
    console.log('=== AIRTABLE DEBUG START ===');
    
    // Check environment variables
    console.log('AIRTABLE_API_KEY exists:', !!process.env.AIRTABLE_API_KEY);
    console.log('AIRTABLE_BASE_ID:', process.env.AIRTABLE_BASE_ID);
    
    if (!process.env.AIRTABLE_API_KEY) {
      throw new Error('AIRTABLE_API_KEY is missing');
    }
    
    if (!process.env.AIRTABLE_BASE_ID) {
      throw new Error('AIRTABLE_BASE_ID is missing');
    }
    
    // Initialize Airtable
    console.log('Initializing Airtable...');
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
      process.env.AIRTABLE_BASE_ID
    );
    
    // Test data
    const testData = {
      From: '+15551234567',
      To: '+15559876543',
      Body: 'Debug test message - ' + new Date().toISOString(),
      Channel: 'debug'
    };
    
    console.log('Test data:', testData);
    
    // Try to create record
    console.log('Attempting to create record...');
    const table = base('Calls');
    
    const result = await table.create([
      {
        fields: testData
      }
    ]);
    
    console.log('Airtable response:', result);
    console.log('=== AIRTABLE DEBUG END ===');
    
    res.status(200).json({
      success: true,
      message: 'Record created successfully',
      data: testData,
      airtableResponse: result
    });
    
  } catch (error) {
    console.error('=== AIRTABLE DEBUG ERROR ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    console.error('=== AIRTABLE DEBUG ERROR END ===');
    
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}
