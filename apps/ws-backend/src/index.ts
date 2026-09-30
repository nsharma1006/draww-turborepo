import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws, request) {
  try {
    const url = request.url;
    const queryParams = new URLSearchParams(url?.split("?")[1]);
    const token = queryParams.get("token");
  
    const decoded = jwt.verify(token || "", process.env.JWT_SECRET || "1234") as {
      userId?: string;
    };
  
    if (!decoded || !decoded.userId) {
      ws.close();
      return;
    }
  } catch (error) {
    console.log("Error :" , error )
    console.log("\n \n Error in catch block")
     ws.close();
  return;
  }
  ws.on("message", function message(data) {
    ws.send("pong");
  });
});
