import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    price: {
      amount: { type: Number, required: true },
      currency: { type: String, enum: ["USD", "DOP"], default: "DOP" }
    },

    address: {
      address: { type: String, required: true },
      city: { type: String },
      coordinates: {
        lat: Number,
        lng: Number
      }
    },

    images: [
      {
        url: String,
        alt: String
      }
    ],

    bedrooms: Number,
    bathrooms: Number,
    area: Number,

    isPublic: {
      type: Boolean,
      default: false
    },

    slug: {
      type: String,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

// Basic indexes
PropertySchema.index({ slug: 1 });
PropertySchema.index({ isPublic: 1 });

export const Property = mongoose.model("Property", PropertySchema);