import express from "express";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";
import {
  createAssignment,
  getCourseAssignments,
  submitAssignment,
  getAssignmentSubmissions,
  gradeSubmission,
  getStudentGradesForCourse,
} from "../controllers/assignmentController.js";

const assignmentRouter = express.Router();

// educator
assignmentRouter.post("/course/:courseId/assignments", isAuth, createAssignment);
assignmentRouter.get("/course/:courseId/assignments", isAuth, getCourseAssignments);

// student
assignmentRouter.post(
  "/assignments/:assignmentId/submissions",
  isAuth,
  upload.single("content"),
  submitAssignment
);

// educator view/grade
assignmentRouter.get(
  "/assignments/:assignmentId/submissions",
  isAuth,
  getAssignmentSubmissions
);
assignmentRouter.post("/submissions/:submissionId/grade", isAuth, gradeSubmission);

// student grades for a course
assignmentRouter.get(
  "/course/:courseId/grades",
  isAuth,
  getStudentGradesForCourse
);

export default assignmentRouter;
