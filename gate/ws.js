import WebSocket from "ws";

export const Gate = async () => {
  try {
    const gateWebSocket = new WebSocket("wss://api.gateio.ws/ws/v4/");

    gateWebSocket.on("open", () => {
      console.log("Gate websocket bağlandı.");
    });

    gateWebSocket.on("message", (data) => {
      const stringData = data.toString();
      const message = JSON.parse(stringData); // Buffer verisini dizeye dönüştürme
    });

    gateWebSocket.onerror = (error) => {
      console.log("WebSocket error: ", error);
    };
  } catch (error) {
    console.error("An error occurred: ", error);
  }
};
