import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import mongoSanitize from "express-mongo-sanitize";
const app = express();

app.use(cors());
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
app.use('/api/v1/users', userRouter)
app.use('/api/v1/contest', contestRouter)
export default app;
