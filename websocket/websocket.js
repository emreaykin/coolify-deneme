import { WebSocketServer } from "ws";
import { dataStore } from "../dataStore.js";

export const startWebsocket = async (server) => {
  try {
    const wss = new WebSocketServer({ server });
    wss.on("connection", async (ws) => {
      console.log("Kullanıcı bağlandı..");
      setInterval(() => {
        ws.send(
          JSON.stringify( sendUpdatedDataToClients() )
        );
      }, 1000);
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

const sendUpdatedDataToClients = () => {
  const updatedData = dataStore.map((item) => {
    // Her bir nesnenin "orderProfit" dizisinden en yüksek "profit" değerine sahip objeyi bulun
    const highestProfitObj = item.orderProfit.reduce(
      (acc, obj) => (obj.profit > acc.profit ? obj : acc),
      item.orderProfit[0]
    );

    // "orderProfit" anahtarını kaldırmadan önce bir kopyasını oluşturun
    const itemCopy = { ...item };

    // "orderProfit" anahtarını kaldırın
    delete itemCopy.orderProfit;

    // Diğer anahtarları "itemCopy" nesnesine ekleyin
    const updatedItem = {
      ...itemCopy,
      ...highestProfitObj,
    };

    // "buyVolume" ve "sellVolume" değerlerini kontrol edin ve gerekli dönüşümleri yapın
    if (updatedItem.buyVolume < 5) {
      updatedItem.buyVolume = parseFloat(updatedItem.buyVolume.toFixed(4));
    } else {
      updatedItem.buyVolume = parseInt(updatedItem.buyVolume);
    }

    if (updatedItem.sellVolume < 5) {
      updatedItem.sellVolume = parseFloat(updatedItem.sellVolume.toFixed(4));
    } else {
      updatedItem.sellVolume = parseInt(updatedItem.sellVolume);
    }

    return updatedItem;
  });
  return updatedData.sort((a, b) => b.profit - a.profit);
};
