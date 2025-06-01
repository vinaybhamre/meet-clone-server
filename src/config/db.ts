import "dotenv/config";
import mongoose from "mongoose";

const mongoURI = process.env.MONGO_URI ?? "";

export const connectToDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    // console.log("Connected to DB");
  } catch (error) {
    console.log("DB connection errors: ", error);

    process.exit(1);
  }
};
