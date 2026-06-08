import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Join a match room
    socket.on("join-match", (matchId: string) => {
      socket.join(matchId);
      console.log(`Socket ${socket.id} joined match ${matchId}`);
    });

    // Send a message
    socket.on("send-message", (data: {
      matchId: string;
      content: string;
      senderId: string;
      senderName: string;
    }) => {
      // Broadcast to everyone in the match room
      io.to(data.matchId).emit("new-message", {
        id: Date.now().toString(),
        content: data.content,
        senderId: data.senderId,
        senderName: data.senderName,
        createdAt: new Date().toISOString(),
      });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  const port = process.env.PORT || 3000;
  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});