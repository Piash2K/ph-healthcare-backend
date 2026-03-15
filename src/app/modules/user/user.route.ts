import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import z from "zod";
import { Gender } from "../../../generated/prisma/enums";
import app from "../../../app";

const createDoctorZodSchema = z.object({
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at most 20 characters long"),
  doctor: z.object({
    name: z
      .string("Name is required")
      .min(5, "Name must be at least 5 characters long")
      .max(30, "Name must be at most 30 characters long"),
    email: z.email("Invalid email format"),
    contactNumber: z
      .string("Contact number is required")
      .min(11, "Contact number must be at least 11 digits long")
      .max(15, "Contact number must be at most 15 digits long"),
    address: z.string("Address is required").min(10, "Address must be at least 10 characters long").max(100, "Address must be at most 100 characters long").optional(),
    registrationNumber: z
      .string("Registration number is required"),
    experience: z.int("Experience must be an integer").nonnegative("Experience must be a non-negative integer").optional(),
    gender: z.enum([Gender.MALE, Gender.FEMALE], "Gender must be either 'Male' or 'Female'"),
    appointmentFee: z.number("Appointment fee must be a number").nonnegative("Appointment fee must be a non-negative number"),
    qualification: z.string("Qualification is required").min(5, "Qualification must be at least 5 characters long").max(50, "Qualification must be at most 50 characters long"),
    currentWorkplace: z.string("Current workplace is required").min(5, "Current workplace must be at least 5 characters long").max(50, "Current workplace must be at most 50 characters long"),
    designation: z.string("Designation is required").min(5, "Designation must be at least 5 characters long").max(50, "Designation must be at most 50 characters long"),
  }),
  specialties: z.array(z.uuid(),"Specialties must be an array of UUIDs").min(1, "At least one specialty is required"),
});

const router = Router();
router.post(
  "/create-doctor",
  (req: Request, res: Response, next: NextFunction) => {
    const parseResult = createDoctorZodSchema.safeParse(req.body);
    if (!parseResult.success) {
      next(parseResult.error);
    }
    req.body = parseResult.data;
    next();
  },
  UserController.createDoctor,
);

export const UserRoutes = router;
