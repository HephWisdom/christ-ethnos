import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
  {
    startsAt: { type: Date, required: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    location: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, trim: true, maxlength: 1200, default: '' },
    registrationUrl: { type: String, trim: true, maxlength: 1000, default: '' },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Event || mongoose.model('Event', eventSchema)
