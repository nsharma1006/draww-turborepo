import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

import { JWT_PASS } from "@repo/backend-common/config";
import type WebSocket from "ws";
const wss = new WebSocketServer({ port: 8080 });
import {prisma} from "@repo/db"
interface User {
  ws: WebSocket;
  rooms: String[];
  userId: string;
}

const users: User[] = [];

const isValid = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token || "", JWT_PASS) as {
      userId?: string;
    };

    if (!decoded || !decoded.userId) {
      return null;
    }
    return decoded.userId;
  } catch (error) {
    return null;
  }
};

wss.on("connection", function connection(ws, request) {
  const url = request.url;
  const queryParams = new URLSearchParams(url?.split("?")[1]);
  const token = queryParams.get("token") || "";
  const userId = isValid(token);
  if (userId === null) {
    ws.close();
    return;
  }
  users.push({
    ws,
    userId,
    rooms: [],
  });

  ws.on("message", async function message(data) {
    const parsedData = JSON.parse(data.toString());
    
    if (parsedData.type === "join-room") {
      const user = users.find((u) => u.ws === ws);
      if (!user) return null;
      user.rooms.push(parsedData.roomId);
      ws.send(JSON.stringify({ type: "joined-room", roomId: parsedData.roomId }));
    }
    if (parsedData.type === "leave-room") {
      const user = users.find((u) => u.ws === ws);
      if (!user) return null;
      user.rooms = user.rooms.filter((roomId) => roomId !== parsedData.roomId);
      ws.send(JSON.stringify({ type: "left-room", roomId: parsedData.roomId }));
    }
    if (parsedData.type === "chat") {
      const room = parsedData.roomId;
      const message = parsedData.message;
      users.forEach((user) => {
        if (user.rooms.includes(room)) {
          user.ws.send(JSON.stringify({ type: "chat", roomId: room, message }));
        }
      });
      try {
        console.log("Saving message to database:", parsedData.message, "from user:", userId, "in room:", parsedData.roomId);
        const chatMessage = await prisma.chat.create({
        data:{
          message : parsedData.message,
          userId : userId,
          roomId : Number(parsedData.roomId)
        }
      })
      } catch (error) {
         console.error("========== CHAT DB ERROR ==========");
  console.error(error);
  console.error("==================================");
        return ws.send(JSON.stringify({ type: "error", message: "Failed to save message" }));
      }
    }
  });
});
