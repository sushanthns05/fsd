import { ContactMessage } from '../models/index.js';

export const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = await ContactMessage.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received. Our team will get back to you shortly.',
      contact,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      messages,
    });
  } catch (err) {
    next(err);
  }
};
