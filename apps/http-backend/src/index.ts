
import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware.js";
import {JWT_PASS} from "@repo/backend-common/config"
import {SignInSchema} from "@repo/common/schema"
import {prisma} from "@repo/db"

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    message: "HTTP Backend is healthy",
  });
});

app.post("/signup", async(req, res) => {
  // Sign Up
  const { email  , password  , name} = req.body;
  const result = SignInSchema.safeParse(req.body)
  if(!result.success){
    return res.json({
      "message" : "Invalid input"
    })
  }
  try {
    const user = await prisma.user.create({
    data :{
      email,
      password,
      name
    }
  })
  res.json({
    userId : user.id,
  })
    
  } catch (error) {
    console.error("========== PRISMA ERROR ==========");
  console.error(error);
  console.error("==================================");

  return res.status(500).json({
    error: error instanceof Error ? error.message : String(error),
  });
  }
  
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  const result = SignInSchema.safeParse(req.body)
  if(!result.success){
    return res.json({
      "message" : "Invalid input"
    })
  }

  const token = jwt.sign(
    {
      userId: "123",
    },
    JWT_PASS || "1234",
  );
  return res.json({ token });
});


app.post("/room" , middleware , (req , res) => {

})
app.listen(3000, () => console.log("HTTP Backend is running on port 3001"));
