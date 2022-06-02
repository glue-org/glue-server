require("dotenv").config();
import { createApp } from "./utils/createApp";
import "./database";

const PORT = process.env.PORT || 3001;

async function main() {
    try {
        const app = createApp();
        app.listen(PORT, () => console.log(`Running on Port ${PORT}`));
    } catch (err) {
        console.log(err);
    }
}

main();
