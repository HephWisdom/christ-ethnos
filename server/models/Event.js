import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
  {
    startsAt: { type: Date, required: true },
    title: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    registrationUrl: { type: String, trim: true, default: '' },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Event || mongoose.model('Event', eventSchema)
