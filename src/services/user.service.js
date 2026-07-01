import prisma from "../config/prisma.js";
import { ApiError } from "../utils/apiResponse.js";
import { hashPassword, comparePassword } from "../utils/hash.util.js";

export const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      profileImage: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    }
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

export const updateUserProfile = async (userId, data, file) => {
  const updateData = { ...data };

  if (file) {
    // Return relative path to the public dir
    updateData.profileImage = `/uploads/${file.filename}`;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      fullName: true,
      phone: true,
      profileImage: true,
      role: true,
      updatedAt: true,
    }
  });

  return updatedUser;
};

export const changeUserPassword = async (userId, oldPassword, newPassword) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await comparePassword(oldPassword, user.password);
  if (!isMatch) {
    throw new ApiError(400, "Incorrect old password");
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return true;
};
