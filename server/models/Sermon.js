import mongoose from 'mongoose'

const sermonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    speaker: { type: String, required: true, trim: true },
    series: { type: String, trim: true, default: '' },
    summary: { type: String, trim: true, default: '' },
    publishedAt: { type: Date, required: true },
    duration: { type: String, required: true, trim: true },
    videoId: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Sermon || mongoose.model('Sermon', sermonSchema)
