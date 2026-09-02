require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const helmet  = require("helmet");
const morgan  = require("morgan");

require("./database/sqlConnection"); // init pool on boot

const authRoutes      = require("./routes/authRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true, service: "bundle-tracking-backend" }));
app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Bundle Tracking backend running on port ${PORT}`));
