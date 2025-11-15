import { propertyService } from "./property.service.js";

export const propertyController = {
  async create(req, res) {
    try {
      const property = await propertyService.create(req.body);
      return res.status(201).json({ success: true, data: property });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  async getPublic(req, res) {
    try {
      const list = await propertyService.listPublic();
      return res.json({ success: true, data: list });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  async getBySlug(req, res) {
    try {
      const property = await propertyService.getBySlug(req.params.slug);
      return res.json({ success: true, data: property });
    } catch (err) {
      return res.status(404).json({ success: false, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const updated = await propertyService.update(req.params.id, req.body);
      return res.json({ success: true, data: updated });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  },

  async remove(req, res) {
    try {
      const deleted = await propertyService.remove(req.params.id);
      return res.json({ success: true, data: deleted });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }
};