let dataStore = null;

import { JupiterPriceA, JupiterPriceB } from "./jupiter/getRoute.js";
import { Gate } from "./gate/ws.js";
import { Mexc } from "./mexc/ws.js";
import { pairList } from "./pairList.js";

const updatePairList = async () => {
  let tokens = await pairList();

  if (tokens) {
    dataStore = tokens;
    JupiterPriceA();
    JupiterPriceB();
    Gate();
    Mexc();
  }
};

const updateBuyData = (
  id,
  buyPrice,
  buyVolume,
  index,
  amount,
  priceImpact,
  quoteResponse
) => {
  const itemToUpdate = dataStore.find((item) => item.id === id);

  if (itemToUpdate) {
    if (amount !== undefined && priceImpact !== undefined) {
      itemToUpdate.amount = amount;
      itemToUpdate.priceImpact = priceImpact;
    }

    const order = itemToUpdate.orderProfit[index];

    if (order) {
      order.buyPrice = buyPrice;
      order.buyVolume = buyVolume;

      // Update profit for this order
      const minVolume = Math.min(order.buyVolume, order.sellVolume);

      order.profit = ((order.sellPrice - order.buyPrice) * minVolume).toFixed(
        4
      );
    }
  }
};

const updateSellData = (
  id,
  sellPrice,
  sellVolume,
  index,
  amount,
  priceImpact,
  quoteResponse
) => {
  const itemToUpdate = dataStore.find((item) => item.id === id);

  if (itemToUpdate) {
    if (amount !== undefined && priceImpact !== undefined) {
      itemToUpdate.amount = amount;
      itemToUpdate.priceImpact = priceImpact;
    }
    const order = itemToUpdate.orderProfit[index];
    if (order) {
      order.sellPrice = sellPrice;
      order.sellVolume = sellVolume;

      // Update profit for this order
      const minVolume = Math.min(order.sellVolume, order.buyVolume);
      order.profit = ((order.sellPrice - order.buyPrice) * minVolume).toFixed(
        4
      );
    }
  }
};
const updatePriceImpactVolume = (id, amount) => {
  const itemToUpdate = dataStore.find((item) => item.id === id);

  if (itemToUpdate) {
    if (itemToUpdate.amount === 0) {
      itemToUpdate.amount = amount;
    }
  }
};

updatePairList();
export {
  dataStore,
  updatePairList,
  updateBuyData,
  updateSellData,
  updatePriceImpactVolume,
};
