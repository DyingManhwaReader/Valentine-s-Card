import emailjs from '@emailjs/nodejs';

emailjs.init(process.env.EMAILJS_PUBLIC_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, flowers, gifts, place, anything } = req.body;

  try {
    const templateParams = {
      name,
      time: new Date().toLocaleString(),
      message: `Favorite Flowers: ${flowers}\nFavorite Gifts: ${gifts}\nFavorite Place: ${place}\nAnything Else: ${anything}`
    };

    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      templateParams
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('EmailJS error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}