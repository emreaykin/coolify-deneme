import { WebSocketServer } from "ws";


export const startWebsocket = async (server) => {
  try {
    const wss = new WebSocketServer({ server });
    wss.on("connection", async (ws) => {
      console.log("Kullanıcı bağlandı..");
     
      ws.on("message", async (message) => {
        let messageStr = message.toString();
        let data = JSON.parse(messageStr);
      });

      ws.on("close", async () => {});

      ws.on("error", async (err) => {
        console.error("WebSocket hatası:", err);
      });
    });
  } catch (error) {}
};

