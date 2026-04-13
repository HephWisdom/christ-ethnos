import mongoose from 'mongoose'

const givingIntentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    phone: { type: String, trim: true, maxlength: 40, default: '' },
    amount: { type: Number, required: true, min: 1, max: 1000000 },
    frequency: {
      type: String,
      enum: ['one-time', 'monthly'],
      default: 'one-time',
    },
    note: { type: String, trim: true, maxlength: 2000, default: '' },
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
