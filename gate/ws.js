import WebSocket from "ws";
import {
  dataStore,
  updateBuyData,
  updateSellData,
} from "../dataStore.js";
import { convertAndFormat } from "../jupiter/utils.js";


export const Gate = async () => {
 

  try {
    const gateWebSocket = new WebSocket("wss://api.gateio.ws/ws/v4/");
 
    const tokens = dataStore.filter((currency) => currency.stockA === "Gate");

    gateWebSocket.on("open", () => {
      console.log("Gate websocket bağlandı.");
      
      tokens.forEach((item) => {
        const currency = item.currencyA;

        gateWebSocket.send(
          JSON.stringify({
            time: 1,
            channel: "spot.order_book",
            event: "subscribe",
            payload: [`${currency}_USDT`, "5", "1000ms"],
          })
        );
      });
    });

    gateWebSocket.on("message", (data) => {
      const stringData = data.toString();
      const message = JSON.parse(stringData); // Buffer verisini dizeye dönüştürme

      if (message.event === "update" && message.channel === "spot.order_book") {
        const coin = message.result.s.split("_")[0];

        let buyPrice = 0;
        let buyVolume = 0;
        let sellPrice = 0;
        let sellVolume = 0;

        for (let i = 0; i < 4; i++) {
          buyPrice = Number(message.result.asks[i][0]);
          buyVolume += Number(message.result.asks[i][1]);
          sellPrice = Number(message.result.bids[i][0]);
          sellVolume += Number(message.result.bids[i][1]);

          updateBuyData(
            "GateJupiter" + coin,
            convertAndFormat(buyPrice),
            parseFloat(buyVolume.toFixed(4)),
            i
          );
          updateSellData(
            "JupiterGate" + coin,
            convertAndFormat(sellPrice),
            parseFloat(sellVolume.toFixed(4)),
            i
          );
        }
      }
  
    
    });

    gateWebSocket.onerror = (error) => {
      console.log("WebSocket error: ", error);
    };
  } catch (error) {
    console.error("An error occurred: ", error);
  }
};
