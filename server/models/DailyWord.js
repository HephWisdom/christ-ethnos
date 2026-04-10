import mongoose from 'mongoose'

const dailyWordSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, trim: true },
    quote: { type: String, required: true, trim: true },
    meditation: { type: String, required: true, trim: true },
    sortOrder: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.DailyWord || mongoose.model('DailyWord', dailyWordSchema)
