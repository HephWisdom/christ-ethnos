import mongoose from 'mongoose'

const dailyWordSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, trim: true, maxlength: 120 },
    quote: { type: String, required: true, trim: true, maxlength: 1000 },
    meditation: { type: String, required: true, trim: true, maxlength: 2000 },
    sortOrder: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.DailyWord || mongoose.model('DailyWord', dailyWordSchema)
