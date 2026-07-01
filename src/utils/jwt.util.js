import jwt from "jsonwebtoken";

export const generateToken = (payload, expiresIn = "1d") => {
  return jwt.sign(payload, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn,
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
  } catch (error) {
    return null;
  }
};
