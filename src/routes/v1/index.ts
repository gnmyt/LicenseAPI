import {Router} from "express";
import { authenticate } from "@middlewares/auth";
import authRoutes from "./auth";
import accountRoutes from "./account";
import projectRoutes from "./project";
import keyRoutes from "./key";
import memberRoutes from "./member";
import infoRoutes from "./info";
import groupRoutes from "./group";
import permissionRoutes from "./permission";
import metaRoutes from "./meta";
import licenseRoutes from "./license";
import validationRoutes from "./validate";

const app: Router = Router();

// Middlewares that don't require authentication
app.use("/info", infoRoutes);
app.use("/auth", authRoutes);
app.use("/user", accountRoutes);
app.use("/validate", validationRoutes);

// Middlewares that require authentication
app.use("/project", authenticate, projectRoutes);
app.use("/key", authenticate, keyRoutes);
app.use("/member", authenticate, memberRoutes);
app.use("/group", authenticate, groupRoutes);
app.use("/permission", authenticate, permissionRoutes);
app.use("/meta", authenticate, metaRoutes);
app.use("/license", authenticate, licenseRoutes);

export default app;