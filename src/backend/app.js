import "dotenv/config"
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import mongoSanitize from "express-mongo-sanitize";
import connectDB from "./database/database.js";
const app = express();
app.use(async (req, res, next) => {
    try {
        await connectDB();
       next();
    } catch (error) {
        res.status(500).json({ message: "Database connection failed" });
    }
});

const allowedOrigins = [ 
  process.env.GOOGLE_REDIRECT_URI,
  "chrome-extension://ocfoegpcgbncghmgajcdjigfligenhka" 
];

app.use(cors({
  origin: function (origin, callback) {
       if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Blocked Origin:", origin); 
      callback(new Error('Blocked by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({
    limit: '16kb'
}))

app.use(express.urlencoded({
    limit: '16kb',
    extended: true
}))


app.use(express.static("public"));

app.use(cookieParser());
app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    value: { ...req.query },
    writable: true,
    configurable: true,
    enumerable: true,
  });
  next();
});
app.use(mongoSanitize({
  replaceWith: '_',
  allowDots: true
}));

import userRouter from "./routes/user.route.js"
import contestRouter from "./routes/contest.route.js";
import { contestSyncToDatabase } from "./services/contest.service.js";
app.use('/api/v1/users', userRouter)
app.use('/api/v1/contests', contestRouter)

app.get("/api/v1/sync-contests", async (req, res) => {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    console.log("Cron job started: Syncing contests...");
    await contestSyncToDatabase();
    return res.status(200).json({ message: "Sync successful" });
  } catch (error) {
    console.error("Cron Error:", error);
    return res.status(500).json({ message: "Sync failed", error: error.message });
  }
});
export default app;
