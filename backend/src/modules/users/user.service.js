import bcrypt from "bcryptjs";
import { User } from "./user.model.js";

/**
 * Handles all user-related operations.
 * (Keeping it simple for a demo backend)
 */
export const userService = {

  /**
   * Register a new user
   */
  async register({ email, password, name }) {
    // Avoid duplicate accounts
    const exists = await User.findOne({ email });
    if (exists) {
      throw new Error("Email is already in use.");
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashed,
      name
    });

    // Never return password
    const result = user.toObject();
    delete result.password;

    return result;
  },

  /**
   * Validate login credentials
   */
  async validateCredentials(email, password) {
    const user = await User.findOne({ email, active: true });

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error("Invalid email or password.");
    }

    // Return minimal safe user data
    const result = user.toObject();
    delete result.password;

    return result;
  },

  /**
   * Basic fetch
   */
  async getById(id) {
    const user = await User.findById(id).select("-password");
    if (!user) {
      throw new Error("User not found.");
    }
    return user;
  },

  /**
   * Update allowed fields
   */
  async update(id, data) {
    if (data.password) {
      // Rehash only if provided
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    }).select("-password");

    if (!updated) {
      throw new Error("User not found.");
    }

    return updated;
  }
};