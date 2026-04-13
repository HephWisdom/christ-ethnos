import mongoose from 'mongoose'

const analyticsEventSchema = new mongoose.Schema(
  {
    visitorId: { type: String, required: true, trim: true, maxlength: 120, index: true },
    sessionId: { type: String, required: true, trim: true, maxlength: 120, index: true },
    eventType: {
      type: String,
      enum: ['page_view', 'cta_click', 'consent_granted'],
      required: true,
      index: true,
    },
    path: { type: String, required: true, trim: true, maxlength: 240, index: true },
    route: { type: String, trim: true, maxlength: 240, default: '' },
    title: { type: String, trim: true, maxlength: 240, default: '' },
    ctaName: { type: String, trim: true, maxlength: 160, default: '' },
    ctaLocation: { type: String, trim: true, maxlength: 160, default: '' },
    referrer: { type: String, trim: true, maxlength: 2000, default: '' },
    referrerHost: { type: String, trim: true, maxlength: 255, default: '' },
    browser: { type: String, trim: true, maxlength: 80, default: 'Unknown' },
    os: { type: String, trim: true, maxlength: 80, default: 'Unknown' },
    deviceType: { type: String, trim: true, maxlength: 40, default: 'unknown' },
    language: { type: String, trim: true, maxlength: 40, default: '' },
    screenWidth: { type: Number, default: 0 },
    screenHeight: { type: Number, default: 0 },
    timezone: { type: String, trim: true, maxlength: 120, default: '' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    occurredAt: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.AnalyticsEvent || mongoose.model('AnalyticsEvent', analyticsEventSchema)
