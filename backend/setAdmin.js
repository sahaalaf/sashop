// setAdmin.js
const mongoose = require("mongoose");
const User = require("./models/userModel");

const mongoURI =
  "mongodb+srv://sarcasticsahal:ErNGIZxAf9P6Zs5B@cluster0.2x1le.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";

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
      // First, list all users to debug
      const users = await User.find({}, "email username role");
      console.log("Existing users:", users);

      const result = await User.updateOne(
        { email: "sahaal@sashop.com" },
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
