import mongoose from 'mongoose'

const eventRegistrationSchema = new mongoose.Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    eventTitle: { type: String, required: true, trim: true },
    eventStartsAt: { type: Date, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: '' },
    attendees: { type: Number, required: true, min: 1, max: 20 },
    notes: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['new', 'confirmed', 'cancelled'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.EventRegistration || mongoose.model('EventRegistration', eventRegistrationSchema)
