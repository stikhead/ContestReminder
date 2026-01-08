import { sql } from "../index.js";

export async function addEmail(req, res) {
  const { name, email, contestId, contestTime } = req.body;

  await sql`INSERT INTO users (name, email, contest_id, contest_time) VALUES (${name}, ${email}, ${contestId}, ${contestTime})`;
  res.status(200).json({ message: "Email added successfully" });
}
