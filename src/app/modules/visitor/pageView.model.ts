import mongoose from "mongoose";

const pageViewSchema = new mongoose.Schema(
  {
    visitorId: {
      type: String,
      required: true,
      index: true,
    },

    sessionId: {
      type: String,
      required: true,
    },

    path: {
      type: String,
      required: true,
    },

    referrer: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

pageViewSchema.index({ createdAt: -1 });
pageViewSchema.index({ visitorId: 1, createdAt: -1 });

export const PageView = mongoose.model(
  "PageView",
  pageViewSchema,
);