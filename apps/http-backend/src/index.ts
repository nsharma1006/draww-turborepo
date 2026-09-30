
import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    message: "HTTP Backend is healthy",
  });
});

app.post("/signup", (req, res) => {
  // Sign Up
  const { email, password } = req.body;
  res.json({
    userId : "119",
  })
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  const token = jwt.sign(
    {
      userId: "123",
    },
    process.env.JWT_SECRET || "1234",
  );
  return res.json({ token });
});


app.post("/room" , middleware , (req , res) => {

})
app.listen(3000, () => console.log("HTTP Backend is running on port 3001"));
