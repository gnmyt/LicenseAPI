import express, { Application, Request, Response } from "express";
import mongoose, { CallbackError } from "mongoose";
import v1Router from "./routes/v1";
import { sendError } from "@utils/error";
import cors from "cors";

const MONGOOSE_STRING = process.env.MONGOOSE_STRING || "mongodb://localhost:27017";

const app: Application = express();
const port: number = parseInt(process.env.SERVER_PORT || "8025");
const isDevelopment: boolean = process.env.NODE_ENV !== "production";

// Configure backend
app.disable("x-powered-by");
app.use(cors());
app.use(express.json());

// Configure routers
app.use("/api/", v1Router); // <- Newest

app.use("/api/v1/", v1Router);

app.use("/api/*", (req: Request, res: Response) => sendError(res, 404, 0, "The provided route could not be found"));

// Start the backend
const run = () =>
    app.listen(port, () => console.log(`LicenseAPI ${isDevelopment ? "development" : "production"} server started under port ${port}`));

// Connect to database
mongoose.connect(MONGOOSE_STRING).then(() => {
    console.log(`Successfully connected to the database @${MONGOOSE_STRING.split("://")[1].split("/")[0]}`);
    run();
}).catch((error: CallbackError) => {
    if (error) throw new Error(`Could not connect to database: ${error.message}`);
});