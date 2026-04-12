import mongoose from 'mongoose'

const prayerRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: '' },
    request: { type: String, required: true, trim: true },
    isPrivate: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['new', 'praying', 'closed'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.PrayerRequest || mongoose.model('PrayerRequest', prayerRequestSchema)
