import bcrypt from "bcryptjs";
import { User } from "../user/user.model.js";
import { AuthToken } from "./auth.model.js";
import { generateTokens } from "../../core/utils/generateTokens.js";

/**
 * Auth service
 * Handles credential validation + token flow.
 */
export const authService = {

  // Register user
  async register({ email, password, name }) {
    const exists = await User.findOne({ email });
    if (exists) throw new Error("Email is already in use.");

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashed,
      name
    });

    const u = user.toObject();
    delete u.password;

    return u;
  },

  // Login
  async login(email, password) {
    const user = await User.findOne({ email, active: true });
    if (!user) throw new Error("Invalid email or password.");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid email or password.");

    const cleanUser = user.toObject();
    delete cleanUser.password;

    // Generate access + refresh
    const tokens = generateTokens(user.id);

    // Save refresh token
    await AuthToken.create({
      userId: user.id,
      refreshToken: tokens.refreshToken
    });

    return { user: cleanUser, tokens };
  },

  // Validate refresh token
  async refresh(refreshToken) {
    if (!refreshToken) throw new Error("Missing refresh token.");

    const stored = await AuthToken.findOne({
      refreshToken,
      valid: true
    });

    if (!stored) throw new Error("Invalid refresh token.");

    const user = await User.findById(stored.userId);
    if (!user || !user.active) throw new Error("User not found.");

    const cleanUser = user.toObject();
    delete cleanUser.password;

    // Generate new tokens
    const newTokens = generateTokens(user.id);

    // Invalidate old refresh token
    stored.valid = false;
    await stored.save();

    // Save new refresh token
    await AuthToken.create({
      userId: user.id,
      refreshToken: newTokens.refreshToken
    });

    return { user: cleanUser, tokens: newTokens };
  },

  // Logout (invalidate current refresh token)
  async logout(refreshToken) {
    await AuthToken.findOneAndUpdate(
      { refreshToken },
      { valid: false }
    );

    return { success: true };
  },

  // Logout all sessions
  async logoutAll(userId) {
    await AuthToken.updateMany(
      { userId },
      { valid: false }
    );

    return { success: true };
  }
};