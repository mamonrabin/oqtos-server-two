import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    visitorId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    firstSeenAt: {
      type: Date,
      default: Date.now,
    },

    lastSeenAt: {
      type: Date,
      default: Date.now,
    },

    totalPageViews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const Visitor = mongoose.model(
  "Visitor",
  visitorSchema,
);