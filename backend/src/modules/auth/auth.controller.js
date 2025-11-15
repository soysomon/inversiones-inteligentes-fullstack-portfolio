import { userService } from "../user/user.service.js";
import { generateTokens } from "../../core/utils/generateTokens.js";

/**
 * Auth controller
 * Keeps handlers clean and minimal.
 */
export const authController = {

  // Register new user
  async register(req, res) {
    try {
      const user = await userService.register(req.body);

      // Generate tokens for immediate session
      const tokens = generateTokens(user.id);

      return res.status(201).json({
        success: true,
        data: {
          user,
          ...tokens
        }
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
  },

  // Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await userService.validateCredentials(email, password);

      const tokens = generateTokens(user.id);

      return res.json({
        success: true,
        data: {
          user,
          ...tokens
        }
      });
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: err.message
      });
    }
  },

  // Returns current user (from token)
  async me(req, res) {
    try {
      const user = await userService.getById(req.user.id);

      return res.json({
        success: true,
        data: user
      });
    } catch (err) {
      return res.status(404).json({
        success: false,
        message: err.message
      });
    }
  }
};