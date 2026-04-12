import mongoose from 'mongoose'

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: '' },
    visitType: {
      type: String,
      enum: ['first-visit', 'online-service', 'pastoral-care', 'serve-team', 'general'],
      default: 'general',
    },
    preferredFollowUp: {
      type: String,
      enum: ['email', 'phone', 'whatsapp'],
      default: 'email',
    },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['new', 'follow_up', 'closed'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema)
