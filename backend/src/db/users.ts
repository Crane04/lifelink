import mongoose from "mongoose";
import { ProfileModel } from "./profile";
export type User = {
  email: string;
  authentication: {
    password: string;
    salt?: string;
    sessionToken?: string;
  };
  username: string;
  fullname: string;
};

const UserSchema = new mongoose.Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
  fullname: { type: String, required: true },
});
UserSchema.post("save", async function (doc) {
  try {
    const existingProfile = await ProfileModel.findOne({ user: doc._id });
    if (!existingProfile) {
      await ProfileModel.create({
        user: doc._id,
        address: "Not provided",
        gender: "Other",
        phoneNumber: "Not provided",
        dateOfBirth: new Date("2000-01-01"),
      });
      console.log(`Profile created for user: ${doc.fullname}`);
    }
  } catch (err) {
    console.error("Error creating profile for new user:", err);
  }
});
export const UserModel = mongoose.model("User", UserSchema);
