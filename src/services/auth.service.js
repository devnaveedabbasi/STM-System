import prisma from "../config/prisma.js";
import { ApiError } from "../utils/apiResponse.js";
import { hashPassword, comparePassword } from "../utils/hash.util.js";
import { generateOTP } from "../utils/otp.util.js";
import { generateToken } from "../utils/jwt.util.js";

const OTP_EXPIRY_MINUTES = 10;

export const registerUser = async (userData) => {
  const { fullName, email, password } = userData;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  const hashedPassword = await hashPassword(password);
  const otp = generateOTP();
  const expiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      emailVerificationOTP: otp,
      emailVerificationOTPExpiry: expiry,
    },
  });

  return { otp }; // returning OTP for dev mode
};

export const verifyOTP = async (email, otp) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isVerified) {
    throw new ApiError(400, "User is already verified");
  }

  if (user.emailVerificationOTP !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  if (user.emailVerificationOTPExpiry < new Date()) {
    throw new ApiError(400, "OTP has expired");
  }

  const updatedUser = await prisma.user.update({
    where: { email },
    data: {
      isVerified: true,
      emailVerificationOTP: null,
      emailVerificationOTPExpiry: null,
    },
  });

  const accessToken = generateToken({ id: updatedUser.id, email: updatedUser.email });
  return { accessToken, user: { id: updatedUser.id, fullName: updatedUser.fullName, email: updatedUser.email } };
};

export const resendOTP = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isVerified) {
    throw new ApiError(400, "User is already verified");
  }

  const otp = generateOTP();
  const expiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: {
      emailVerificationOTP: otp,
      emailVerificationOTPExpiry: expiry,
      resendOTPAttempts: { increment: 1 },
    },
  });

  return { otp }; // returning OTP for dev mode
};

export const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email first");
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = generateToken({ id: user.id, email: user.email });

  return { 
    accessToken, 
    user: { 
      id: user.id, 
      fullName: user.fullName, 
      email: user.email, 
      role: user.role, 
      profileImage: user.profileImage 
    } 
  };
};

export const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const otp = generateOTP();
  const expiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: {
      forgotPasswordOTP: otp,
      forgotPasswordOTPExpiry: expiry,
    },
  });

  return { otp }; // dev mode
};

export const verifyForgotPasswordOTP = async (email, otp) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.forgotPasswordOTP !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  if (user.forgotPasswordOTPExpiry < new Date()) {
    throw new ApiError(400, "OTP has expired");
  }

  return true;
};

export const resetPassword = async (email, otp, newPassword) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.forgotPasswordOTP !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  if (user.forgotPasswordOTPExpiry < new Date()) {
    throw new ApiError(400, "OTP has expired");
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
      forgotPasswordOTP: null,
      forgotPasswordOTPExpiry: null,
    },
  });

  return true;
};

export const logoutUser = async (userId) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
  return true;
};
