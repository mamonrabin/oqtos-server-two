import mongoose from "mongoose";

const visitorSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },

    visitorId: {
      type: String,
      required: true,
      index: true,
    },

    currentPath: {
      type: String,
      default: "/",
    },

    lastSeenAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true },
);

visitorSessionSchema.index({
  visitorId: 1,
  lastSeenAt: -1,
});

export const VisitorSession = mongoose.model(
  "VisitorSession",
  visitorSessionSchema,
);