import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const DBconnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "error", {});
  } catch (err) {
    console.error(`Error: ${err}`);
  }
};

export const closeDBConnection = async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed successfully");
  } catch (err) {
    console.error(`Error closing MongoDB connection: ${err}`);
  }
};
