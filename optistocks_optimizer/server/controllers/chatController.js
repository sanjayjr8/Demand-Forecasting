/*require('dotenv').config();
const twilio = require("twilio");
const { getPredictions } = require("./data.js");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendWhatsAppMessage = async (req, res) => {
  const { companyId } = req.params;
  const predictionData = await getPredictions(companyId);
  
  if (req.method === 'GET') {
    return res.status(200).json(predictionData);
  }
  
  const messageBody = predictionData.map(p => `Stock: ${p.stockName}, Purchase Quantity: ${p.purchaseQuantity}`).join('\n');

  const message = await client.messages.create({
    from: "whatsapp:+14155238886",
    body: messageBody,
    to: "whatsapp:+919142681475",  
  });

  res.status(200).json({ message: "WhatsApp message sent", predictionData });
};

module.exports = { sendWhatsAppMessage };*/

require('dotenv').config();
const twilio = require("twilio");
const { getPredictions } = require("./data.js");

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID; // Ensure this is added to .env

if (!accountSid || !authToken || !messagingServiceSid) {
  throw new Error('Twilio credentials are missing. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_MESSAGING_SERVICE_SID in the environment variables.');
}

const client = twilio(accountSid, authToken);

const sendSMSMessage = async (req, res) => {
  try {
    const { companyId } = req.params;
    const predictionData = await getPredictions(companyId);

    if (!predictionData || predictionData.length === 0) {
      return res.status(404).json({ error: 'No prediction data found for the specified company.' });
    }

    // Handle GET request separately for getting prediction data
    if (req.method === 'GET') {
      return res.status(200).json(predictionData);
    }

    // Prepare message body for the SMS
    const messageBody = predictionData
      .map(p => `Stock: ${p.stockName}, Purchase Quantity: ${p.purchaseQuantity}`)
      .join('\n');

    // Define recipient phone number; can be passed dynamically or default to given number
    const recipientPhoneNumber = req.body.phoneNumber || '+919282159499'; // Default phone number

    // Send SMS using Twilio
    const message = await client.messages.create({
      body: messageBody,
      messagingServiceSid: MGfe9b675b33042ebddac9c3c1b8282843, // Use your Messaging Service SID
      to: 9282159499 ,                // The phone number to send SMS
    });

    // Respond with success message and the prediction data
    return res.status(200).json({ message: "SMS sent successfully", predictionData, twilioMessageId: message.sid });
  } catch (error) {
    console.error('Error sending SMS:', error);
    return res.status(500).json({ error: 'Failed to send SMS', details: error.message });
  }
};

module.exports = { sendSMSMessage };
