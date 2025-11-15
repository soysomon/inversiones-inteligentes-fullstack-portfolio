import mongoose from "mongoose";

const AuthTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    refreshToken: {
      type: String,
      required: true
    },

    // Track if token was invalidated
    valid: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Index for faster token lookups
AuthTokenSchema.index({ userId: 1 });

export const AuthToken = mongoose.model("AuthToken", AuthTokenSchema);