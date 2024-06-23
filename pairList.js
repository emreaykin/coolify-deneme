import { gateTokenList } from "./gate/gate.js";
import { jupiterTokenList } from "./jupiter/jup.js";
import { mexcTokenList } from "./mexc/mexc.js";


export const pairList = async () => {
    const [gateList, mexcList, jupiterList] = await Promise.all([
      gateTokenList(),
      mexcTokenList(),
      jupiterTokenList(),
    ]);
  
    const createExchangeObject = (
      exchangeName,
      token,
      jupiterToken,
      reverse = false
    ) => {
      const exchangeOneName = reverse ? exchangeName : "Jupiter";
      const exchangeTwoName = reverse ? "Jupiter" : exchangeName;
      const currency = token.currency.toUpperCase();
      const currencyA = reverse ? token.currency.toUpperCase() : jupiterToken.currency.toUpperCase();
      const currencyB = reverse ? jupiterToken.currency.toUpperCase() : token.currency.toUpperCase();
      return {
        stockA: exchangeOneName,
        orderProfit: [
          {
            buyPrice: 0,
            buyVolume: 0,
            sellPrice: 0,
            sellVolume: 0,
            netprofit: 0,
            profit: 0,
          },
          {
            buyPrice: 0,
            buyVolume: 0,
            sellPrice: 0,
            sellVolume: 0,
            netprofit: 0,
            profit: 0,
          },
          {
            buyPrice: 0,
            buyVolume: 0,
            sellPrice: 0,
            sellVolume: 0,
            netprofit: 0,
            profit: 0,
          },
          {
            buyPrice: 0,
            buyVolume: 0,
            sellPrice: 0,
            sellVolume: 0,
            netprofit: 0,
            profit: 0,
          },
        ],
        stockB: exchangeTwoName,
        currencyA:currencyA,
        currencyB:currencyB,
        currency: currency,
        contractAddress: jupiterToken.contractAddress,
        decimals: jupiterToken.decimals,
        logoURI: jupiterToken.logoURI,
        amount: exchangeOneName === "Jupiter" ? 50 : 0,
        priceImpact: 0,
        id: `${exchangeOneName}${exchangeTwoName}${currency}`,
      };
    };
  
    const filteredGatePairs = gateList.flatMap((token) => {
        if (token.contractAddress === null) return [];
        const jupiterToken = jupiterList.find(
          (jToken) =>
            jToken.contractAddress === token.contractAddress
        );
        return jupiterToken
          ? [
              createExchangeObject("Gate", token, jupiterToken),
              createExchangeObject("Gate", token, jupiterToken, true),
            ]
          : [];
      })
      .filter(Boolean);
  
  
    const filteredMexcPairs = mexcList.flatMap((token) => {
        if (token.contractAddress === null) return [];
        const jupiterToken = jupiterList.find((jToken) => {
          const tokenAddress = token.contractAddress;
          const jTokenAddress = jToken.contractAddress;
          return (
            jTokenAddress === tokenAddress
          
          );
        });
        return jupiterToken
          ? [
              createExchangeObject("Mexc", token, jupiterToken),
              createExchangeObject("Mexc", token, jupiterToken, true),
            ]
          : [];
      })
      .filter(Boolean);
  
  
  
    const pairs = filteredGatePairs.concat(filteredMexcPairs);
    const updatedPairs = pairs.map(pair => {
        if (pair.orderProfit && pair.orderProfit.length > 0) {
            pair.orderProfit.forEach(orderProfit => {
                if (orderProfit.withdrawMin === undefined) {
                    orderProfit.withdrawMin = 0;
                }
                if (orderProfit.withdrawFee === undefined) {
                    orderProfit.withdrawFee = 0;
                }
            });
        }
        return pair;
    });
    try {
      return updatedPairs;
    } catch (error) {
      console.error(`Veri kaydedilirken bir hata oluştu: ${error}`);
    }
  };
  

  