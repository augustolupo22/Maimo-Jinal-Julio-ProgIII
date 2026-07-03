import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function getUsers() {
  await connectDB();
  return User.find().select("-password").sort({ createdAt: -1 }).lean();
}

export async function getUserById(id) {
  await connectDB();
  return User.findById(id).select("-password").lean();
}

export async function getUserByEmail(email) {
  await connectDB();
  return User.findOne({ email: email.toLowerCase() }).lean();
}
