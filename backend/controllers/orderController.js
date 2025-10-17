import Course from "../models/courseModel.js";
import razorpay from 'razorpay'
import User from "../models/userModel.js";
import dotenv from "dotenv"
dotenv.config()
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
})

export const createOrder = async (req, res) => {
  try {
    const { courseId, userId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const priceNumber = Number(course.price);
    const amount = Math.round((isNaN(priceNumber) ? 0 : priceNumber) * 100);

    // If course is free or price is not set, enroll without creating a payment order
    if (!amount || amount <= 0) {
      if (!userId) {
        return res.status(400).json({ message: "userId required for free enrollment" });
      }

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      // Idempotent enrollment updates
      if (!user.enrolledCourses.map(String).includes(String(courseId))) {
        user.enrolledCourses.push(courseId);
        await user.save();
      }

      if (!course.enrolledStudents.map(String).includes(String(userId))) {
        course.enrolledStudents.push(userId);
        await course.save();
      }

      return res.status(200).json({
        free: true,
        message: "Course is free. Enrollment successful.",
        courseId,
        userId,
      });
    }

    // Paid flow — ensure Razorpay keys exist
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
      return res.status(500).json({ message: "Payment gateway not configured" });
    }

    const options = {
      amount, // in paisa
      currency: 'INR',
      receipt: String(courseId),
    };

    const order = await razorpayInstance.orders.create(options);
    return res.status(200).json(order);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `Order creation failed ${err}` });
  }
};



export const verifyPayment = async (req, res) => {
  try {
        const {razorpay_order_id , courseId , userId} = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        if(orderInfo.status === 'paid') {
      // Update user and course enrollment
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      if (!user.enrolledCourses.map(String).includes(String(courseId))) {
        user.enrolledCourses.push(courseId);
        await user.save();
      }

      const course = await Course.findById(courseId).populate("lectures");
      if (!course) return res.status(404).json({ message: "Course not found" });
      if (!course.enrolledStudents.map(String).includes(String(userId))) {
        course.enrolledStudents.push(userId);
        await course.save();
      }

      return res.status(200).json({ message: "Payment verified and enrollment successful" });
    } else {
      return res.status(400).json({ message: "Payment verification failed (invalid signature)" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error during payment verification" });
  }
};
