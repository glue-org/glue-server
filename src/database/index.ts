import mongoose from "mongoose";

console.log(process.env.MONGO_USER);
console.log(process.env.MONGO_PASS);

mongoose
    .connect(process.env.MONGO_URL!, {
        auth: {
            username: process.env.MONGO_USER!,
            password: process.env.MONGO_PASS!,
        },
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB", err));
