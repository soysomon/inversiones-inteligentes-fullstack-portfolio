import { userService } from "./user.service.js";

export const userController = {
  async getProfile(req, res) {
    try {
      const user = await userService.getById(req.user.id);
      return res.json({ success: true, data: user });
    } catch (err) {
      return res.status(404).json({ success: false, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const updated = await userService.update(req.user.id, req.body);
      return res.json({ success: true, data: updated });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }
};