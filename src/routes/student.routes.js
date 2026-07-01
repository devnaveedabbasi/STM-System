import { Router } from "express";
import * as StudentController from "../controllers/student.controller.js";
import { studentSchema } from "../validations/student.validation.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.post(
  "/add",
  validate(studentSchema),
  StudentController.addStudent
);

router.get("/all", StudentController.getAllStudents);

router.get("/:id", StudentController.getStudent);

router.put(
  "/:id",
  validate(studentSchema),
  StudentController.updateStudent
);

router.delete("/:id", StudentController.deleteStudent);

export default router;