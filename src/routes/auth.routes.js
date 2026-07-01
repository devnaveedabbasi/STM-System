import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validate } from "../middleware/validation.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  registerSchema,
  verifyOtpSchema,
  resendOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validations/auth.validation.js";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/verify-otp", validate(verifyOtpSchema), authController.verifyOTP);
router.post("/resend-otp", validate(resendOtpSchema), authController.resendOTP);
router.post("/login", validate(loginSchema), authController.login);
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/verify-forgot-password-otp", validate(verifyOtpSchema), authController.verifyForgotPasswordOTP);
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);

// Protected routes
router.post("/logout", verifyJWT, authController.logout);

export default router;
