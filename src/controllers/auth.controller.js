import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import * as authService from "../services/auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const { otp } = await authService.registerUser(req.body);
  res.status(201).json(new ApiResponse(201, { otp }, "OTP generated successfully"));
});

export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const result = await authService.verifyOTP(email, otp);
  res.status(200).json(new ApiResponse(200, result, "Account verified successfully"));
});

export const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { otp } = await authService.resendOTP(email);
  res.status(200).json(new ApiResponse(200, { otp }, "OTP resent successfully"));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  res.status(200).json(new ApiResponse(200, result, "Login successful"));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { otp } = await authService.forgotPassword(email);
  res.status(200).json(new ApiResponse(200, { otp }, "Password reset OTP generated"));
});

export const verifyForgotPasswordOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  await authService.verifyForgotPasswordOTP(email, otp);
  res.status(200).json(new ApiResponse(200, null, "OTP verified successfully"));
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  await authService.resetPassword(email, otp, newPassword);
  res.status(200).json(new ApiResponse(200, null, "Password reset successfully"));
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logoutUser(req.user.id);
  res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});
