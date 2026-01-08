import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
const port = process.env.PORT;

import { neon } from "@neondatabase/serverless";
export const sql = neon(process.env.DATABASE_URL);

import { addEmail } from "./controllers/addEmail.js";
import { sendSimpleMessage } from "./template/sendEmail.js";

app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Server listening to ${port}.`);
});

app.post("/newSubscription", addEmail);
app.get("/notif", sendSimpleMessage);
