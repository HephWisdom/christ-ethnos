import mongoose from 'mongoose'

const prayerRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, trim: true, lowercase: true, maxlength: 160, default: '' },
    request: { type: String, required: true, trim: true, maxlength: 4000 },
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
