import { verifyToken } from "../utils/jwt.util.js";
import { ApiError } from "../utils/apiResponse.js";
import prisma from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedToken = verifyToken(token);

  if (!decodedToken) {
    throw new ApiError(401, "Invalid access token");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: decodedToken.id,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      isVerified: true,
    }
  });

  if (!user) {
    throw new ApiError(401, "Invalid access token");
  }

  req.user = user;
  next();
});
