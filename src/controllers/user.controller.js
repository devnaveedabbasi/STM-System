import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import * as userService from "../services/user.service.js";

export const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserProfile(req.user.id);
  res.status(200).json(new ApiResponse(200, user, "Profile fetched successfully"));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await userService.updateUserProfile(req.user.id, req.body, req.file);
  res.status(200).json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  await userService.changeUserPassword(req.user.id, oldPassword, newPassword);
  res.status(200).json(new ApiResponse(200, null, "Password changed successfully"));
});
