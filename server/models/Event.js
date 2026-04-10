import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
  {
    startsAt: { type: Date, required: true },
    title: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Event || mongoose.model('Event', eventSchema)
