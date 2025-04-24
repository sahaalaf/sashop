require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/userModel");

const mongoURI = process.env.MONOGODB_URI;

console.log("MongoDB URI:", mongoURI);

if (!mongoURI) {
  throw new Error(
    "MongoDB URI is undefined. Please check the mongoURI variable."
  );
}

mongoose
  .connect(mongoURI)
  .then(async () => {
    console.log("Connected to MongoDB Atlas");
    try {
      const users = await User.find({}, "email username role");
      console.log("Existing users:", users);

      const result = await User.updateOne(
        { email: process.env.ADMIN_MAIL },
        { $set: { role: "admin" } }
      );
      console.log("Update result:", result);
      if (result.modifiedCount === 0) {
        console.log(
          "No user found with that email or role already set to admin."
        );
      } else {
        console.log("Successfully set user as admin.");
      }
    } catch (err) {
      console.error("Error setting admin:", err);
    } finally {
      mongoose.connection.close();
      console.log("Database connection closed.");
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
