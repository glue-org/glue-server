import mongoose from "mongoose";

console.log(process.env.MONGO_USER);
console.log(process.env.MONGO_PASS);

mongoose
    .connect(process.env.MONGO_URL!)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB", err));
