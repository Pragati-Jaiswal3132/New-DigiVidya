import Assignment from "../models/assignmentModel.js";
import Submission from "../models/submissionModel.js";
import uploadOnCloudinary from "../configs/cloudinary.js";
import Course from "../models/courseModel.js";

export const createAssignment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, dueDate, maxPoints } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Ensure only course creator can create assignments
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.creator?.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to create assignments for this course" });
    }

    const assignment = await Assignment.create({
      course: courseId,
      title,
      description,
      dueDate,
      maxPoints,
      createdBy: req.userId,
    });

    return res.status(201).json(assignment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Failed to create assignment ${error}` });
  }
};

export const getCourseAssignments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const assignments = await Assignment.find({ course: courseId }).sort({ createdAt: -1 });
    return res.status(200).json(assignments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Failed to get assignments ${error}` });
  }
};

export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { textAnswer } = req.body;

    let contentUrl;
    if (req.file) {
      contentUrl = await uploadOnCloudinary(req.file.path);
    }

    const submission = await Submission.create({
      assignment: assignmentId,
      student: req.userId,
      contentUrl,
      textAnswer,
    });

    return res.status(201).json(submission);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Failed to submit assignment ${error}` });
  }
};

export const getAssignmentSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    const course = await Course.findById(assignment.course);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.creator?.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to view submissions for this course" });
    }
    const submissions = await Submission.find({ assignment: assignmentId }).populate("student", "name email");
    return res.status(200).json(submissions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Failed to get submissions ${error}` });
  }
};

export const gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { grade, feedback } = req.body;

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // ensure educator owns the course
    const assignment = await Assignment.findById(submission.assignment);
    const course = await Course.findById(assignment.course);
    if (course.creator?.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to grade this submission" });
    }

    submission.grade = grade;
    submission.feedback = feedback;
    await submission.save();

    return res.status(200).json(submission);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Failed to grade submission ${error}` });
  }
};

export const getStudentGradesForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    // All submissions for this student/course
    const assignments = await Assignment.find({ course: courseId }).select("_id maxPoints");
    const assignmentIds = assignments.map(a => a._id);

    const submissions = await Submission.find({ assignment: { $in: assignmentIds }, student: req.userId });

    const totalEarned = submissions.reduce((sum, s) => sum + (s.grade || 0), 0);
    const totalPossible = assignments.reduce((sum, a) => sum + (a.maxPoints || 0), 0) || 0;
    const percent = totalPossible ? Math.round((totalEarned / totalPossible) * 100) : 0;

    return res.status(200).json({ totalEarned, totalPossible, percent, submissions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Failed to get grades ${error}` });
  }
};
