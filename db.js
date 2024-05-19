import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;

async function run() {
  try {
    await mongoose.connect(DB_URI);
    console.log("Database connection successful");
  } catch (err) {
    console.error("Database connection failure:", err);
    process.exit(1);
  }
  // } finally {
  //   await mongoose.disconnect();
  // }
}

run().catch(console.dir);
