import WebSocket from "ws";
import { dataStore, updateBuyData, updateSellData } from "../dataStore.js";
import { convertAndFormat } from "../jupiter/utils.js";

export const Mexc = async () => {
  try {
    //  let listenKey = await createListenKey();
    const tokens = dataStore.filter((currency) => currency.stockA === "Mexc");
    let tokenChunks = [];
    const chunkSize = 30;
    for (let i = 0; i < tokens.length; i += chunkSize) {
      tokenChunks.push(tokens.slice(i, i + chunkSize));
    }

    tokenChunks.forEach((chunk, index) => {
      const mexcWebsocket = new WebSocket(`wss://wbs.mexc.com/ws`);

      mexcWebsocket.on("open", () => {
        console.log(`Mexc websocket ${index + 1} bağlandı.`);

        chunk.forEach((token) => {
          const currency = token.currencyA;

          let subscribeMessage = {
            method: "SUBSCRIPTION",
            params: ["spot@public.limit.depth.v3.api@" + currency + "USDT@5"],
          };

          mexcWebsocket.send(JSON.stringify(subscribeMessage));
        });
      });
      const PING_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
      mexcWebsocket.on("message", async (data) => {
        let parsedData = JSON.parse(data.toString());

        // Check if it's a PONG message
        if (parsedData.msg === "PONG") {
          console.log("Connection is still alive");
        }

        // Your existing code
        if (
          parsedData.s &&
          parsedData.c.includes("spot@public.limit.depth.v3.api")
        ) {
          const coin = parsedData.s.split("USDT")[0];

          let buyPrice = 0;
          let buyVolume = 0;
          let sellPrice = 0;
          let sellVolume = 0;

          for (let i = 0; i < 4; i++) {
            buyPrice = Number(parsedData.d.asks[i]?.p);
            buyVolume += Number(parsedData.d.asks[i]?.v);
            sellPrice = Number(parsedData.d.bids[i]?.p);
            sellVolume += Number(parsedData.d.bids[i]?.v);
            updateBuyData(
              "MexcJupiter" + coin,
              convertAndFormat(buyPrice),
              parseFloat(buyVolume.toFixed(4)),
              i
            );
            updateSellData(
              "JupiterMexc" + coin,
              convertAndFormat(sellPrice),
              parseFloat(sellVolume.toFixed(4)),
              i
            );
          }
        }
      });
      // Send a PING message every 5 minutes
      setInterval(async () => {
        mexcWebsocket.send(JSON.stringify({ method: "PING" }));
      }, PING_INTERVAL);

      mexcWebsocket.on("close", () => {
        console.log(`Mexc websocket ${index + 1} kapandı.`);
      });

      mexcWebsocket.on("error", (err) => {
        console.log(`Mexc websocket ${index + 1} hata:`, err);
      });
    });
  } catch (error) {
    console.error("Hata:", error);
  }
};
