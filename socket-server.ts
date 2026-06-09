import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-match", (matchId: string) => {
    socket.join(matchId);
    console.log(`Socket ${socket.id} joined match ${matchId}`);
  });

  socket.on("send-message", (data: {
    matchId: string;
    content: string;
    senderId: string;
    senderName: string;
  }) => {
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

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});