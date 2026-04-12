import mongoose from 'mongoose'

const givingIntentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: '' },
    amount: { type: Number, required: true, min: 1 },
    frequency: {
      type: String,
      enum: ['one-time', 'monthly'],
      default: 'one-time',
    },
    note: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.GivingIntent || mongoose.model('GivingIntent', givingIntentSchema)
