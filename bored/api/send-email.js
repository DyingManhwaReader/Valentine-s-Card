import emailjs from '@emailjs/nodejs';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize EmailJS with environment variables (never in client code)
    emailjs.init(process.env.EMAILJS_PUBLIC_KEY);

    const { name, flowers, gifts, place, anything } = req.body;

    // Validate required fields
    if (!name || !flowers || !gifts || !place) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create email template parameters
    const templateParams = {
      name: name.trim(),
      flowers: flowers.trim(),
      gifts: gifts.trim(),
      place: place.trim(),
      anything: anything ? anything.trim() : 'Nothing else',
      time: new Date().toLocaleString()
    };

    // Send email via EmailJS
    const result = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('Email sent successfully:', result);
    return res.status(200).json({ success: true, message: 'Email sent successfully' });

  } catch (error) {
    console.error('EmailJS error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to send email',
      details: error.message 
    });
  }
}
