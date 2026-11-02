import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      lowercase: true,
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Please enter a subject'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please enter your message'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'read', 'responded', 'archived'],
      default: 'new',
    },
    replyNotes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
