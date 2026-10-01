
import express from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware.js";
import {JWT_PASS} from "@repo/backend-common/config"
import {SignInSchema , SignUpSchema , RoomSchema} from "@repo/common/schema"
import {prisma} from "@repo/db"
import bcrypt from "bcrypt"

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    message: "HTTP Backend is healthy",
  });
});

app.post("/signup", async(req, res) => {
  // Sign Up
  const result = SignUpSchema.safeParse(req.body)
  if(!result.success){
    return res.json({
      "message" : "Invalid input"
    })
  }
  console.log("========== SIGN UP ==========");
  const hashedPassword = await bcrypt.hash(result.data.password, 10); 
  try {
    const user = await prisma.user.create({
    data :{
      email : result.data.email,
      password : hashedPassword,
      name : result.data.name
    }
  })
  return res.json({
    userId : user.id,
  })
    
  } catch (error) {
  
    console.error("========== PRISMA ERROR ==========");
  console.error(error);
  console.error(error instanceof Error ? error.message : String(error));
  console.error("==================================");

  return res.status(500).json({
    error: error instanceof Error ? error.message : error,
  });
  }
  
});

app.post("/signin", async (req, res) => {
  const result = SignInSchema.safeParse(req.body)
  if(!result.success){
    return res.json({
      "message" : "Invalid input"
    })
  }
  const findingUser = await prisma.user.findUnique({
    where:{
      email : result.data.email
    }
  })
  if(!findingUser){
    return res.json({
      "message" : "Such account doesn't exist"
    })
  }

  const isMatched = await bcrypt.compare(result.data.password, findingUser.password)
  if(!isMatched){
    return res.json({
      "message" : "Password is incorrect"
    })
  }

  const token = jwt.sign(
    {
      userId: findingUser.id,
    },
    JWT_PASS || "",
  );
  return res.json({ token });
});


app.post("/room" , middleware , async (req , res) => {
  const parsedData = RoomSchema.safeParse(req.body)
  if(!parsedData.success){
    return res.json({
      "message" : "Invalid input"
    })
  }
  const userId = req.userId
  if(!userId){
    return res.json({
      "message" : "User not authenticated"
    })
  }

  const room = await prisma.room.create({
    data : {
      name : parsedData.data.name,
      adminId : userId
    }
  })

  return res.json({
    roomId : room.id,
  })
})
app.listen(3000, () => console.log("HTTP Backend is running on port 3000"));
