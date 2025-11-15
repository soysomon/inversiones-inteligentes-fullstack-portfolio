import jwt from "jsonwebtoken";

/**
 * Simple auth middleware.
 * Checks for Bearer token and validates it.
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // No auth header → block request
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Missing token."
    });
  }

  // Extract token
  const token = authHeader.split(" ")[1];

  try {
    // Validate and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (basic info is enough here)
    req.user = {
      id: decoded.sub,
      token
    };

    next();
  } catch (err) {
    // Token invalid or expired
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token."
    });
  }
};