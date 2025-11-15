import { Property } from "./property.model.js";
import { slugify } from "../../core/utils/slugify.js";

export const propertyService = {
  // Create property
  async create(data) {
    // Generate slug (simple but effective)
    data.slug = slugify(data.title);

    const exists = await Property.findOne({ slug: data.slug });
    if (exists) {
      throw new Error("A property with a similar title already exists.");
    }

    const property = await Property.create(data);
    return property;
  },

  // Get by slug
  async getBySlug(slug) {
    const property = await Property.findOne({ slug, isPublic: true });

    if (!property) {
      throw new Error("Property not found.");
    }

    return property;
  },

  // Admin-only: get by ID
  async getById(id) {
    const property = await Property.findById(id);
    if (!property) throw new Error("Property not found.");
    return property;
  },

  // Public list
  async listPublic() {
    return Property.find({ isPublic: true }).sort({ createdAt: -1 });
  },

  // Admin list
  async listAll() {
    return Property.find().sort({ createdAt: -1 });
  },

  // Update property
  async update(id, data) {
    if (data.title) {
      data.slug = slugify(data.title);
    }

    const updated = await Property.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });

    if (!updated) throw new Error("Property not found.");

    return updated;
  },

  // Delete
  async remove(id) {
    const deleted = await Property.findByIdAndDelete(id);
    if (!deleted) throw new Error("Property not found.");
    return deleted;
  }
};