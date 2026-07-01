import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { validate } from "../middleware/validation.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "../validations/user.validation.js";

const router = Router();

// All routes here are protected
router.use(verifyJWT);

router.get("/profile", userController.getProfile);

router.put(
  "/profile",
  upload.single("profileImage"),
  validate(updateProfileSchema),
  userController.updateProfile
);

router.post(
  "/change-password",
  validate(changePasswordSchema),
  userController.changePassword
);

export default router;
