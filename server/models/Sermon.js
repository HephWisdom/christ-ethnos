import mongoose from 'mongoose'

const sermonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    speaker: { type: String, required: true, trim: true, maxlength: 120 },
    series: { type: String, trim: true, maxlength: 120, default: '' },
    summary: { type: String, trim: true, maxlength: 1000, default: '' },
    publishedAt: { type: Date, required: true },
    duration: { type: String, required: true, trim: true, maxlength: 20 },
    videoId: { type: String, required: true, trim: true, maxlength: 120 },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Sermon || mongoose.model('Sermon', sermonSchema)
