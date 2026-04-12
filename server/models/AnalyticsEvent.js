import mongoose from 'mongoose'

const analyticsEventSchema = new mongoose.Schema(
  {
    visitorId: { type: String, required: true, trim: true, index: true },
    sessionId: { type: String, required: true, trim: true, index: true },
    eventType: {
      type: String,
      enum: ['page_view', 'cta_click', 'consent_granted'],
      required: true,
      index: true,
    },
    path: { type: String, required: true, trim: true, index: true },
    route: { type: String, trim: true, default: '' },
    title: { type: String, trim: true, default: '' },
    ctaName: { type: String, trim: true, default: '' },
    ctaLocation: { type: String, trim: true, default: '' },
    referrer: { type: String, trim: true, default: '' },
    referrerHost: { type: String, trim: true, default: '' },
    browser: { type: String, trim: true, default: 'Unknown' },
    os: { type: String, trim: true, default: 'Unknown' },
    deviceType: { type: String, trim: true, default: 'unknown' },
    language: { type: String, trim: true, default: '' },
    screenWidth: { type: Number, default: 0 },
    screenHeight: { type: Number, default: 0 },
    timezone: { type: String, trim: true, default: '' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    occurredAt: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.AnalyticsEvent || mongoose.model('AnalyticsEvent', analyticsEventSchema)
