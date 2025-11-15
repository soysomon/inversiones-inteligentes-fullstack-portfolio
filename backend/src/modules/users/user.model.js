import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    // Optional display name
    name: {
      type: String,
      trim: true
    },

    // Basic role system (enough for a demo)
    role: {
      type: String,
      enum: ["admin", "agent"],
      default: "agent"
    },

    // Soft-delete or disable access
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true // createdAt / updatedAt auto
  }
);

// Simple index for faster lookups
UserSchema.index({ email: 1 });

export const User = mongoose.model("User", UserSchema);