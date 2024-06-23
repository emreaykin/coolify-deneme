
import fetch from 'node-fetch';
import HttpProxyAgent from 'https-proxy-agent';
import {
  utilsWeb3js,
  convertAndFormat,
  calculatePriceImpact,
} from "./utils.js";
import {
  dataStore,
  updateBuyData,
  updateSellData,
  updatePriceImpactVolume,
} from "../dataStore.js";
const USDT_ADRESS = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";
const USDT_DECIMAL = 6;

const JUP_URI = "http://quote-api.jup.ag/v6/quote?inputMint=";
const JUP_URI_END =
  "&onlyDirectRoutes=false&asLegacyTransaction=false";
  
  const proxyAgent = new HttpProxyAgent.HttpsProxyAgent('http://caekkhvuu-rotate:na63co3eo1hb@p.webshare.io:80/');
const processToken = async (token, isExchangeOne) => {
  if(token.currency==="PANDA"){
    console.log(token.contractAddress)
    console.log(token.contractAddress)
  }
  const tokenA_amount = token.amount;
  const tokenB = token.contractAddress;
  const tokenB_decimal = token.decimals;
  const result = await quote_api(
    isExchangeOne ? USDT_ADRESS : tokenB,
    isExchangeOne ? USDT_DECIMAL : tokenB_decimal,
    tokenA_amount,
    isExchangeOne ? tokenB : USDT_ADRESS
  );
 

  if (result) {
    const price = isExchangeOne
      ? 1 /
        utilsWeb3js(
          USDT_DECIMAL,
          tokenB_decimal,
          result.inAmount,
          result.outAmount
        )
      : utilsWeb3js(
          tokenB_decimal,
          USDT_DECIMAL,
          result.inAmount,
          result.outAmount
        );
        
    const volume = isExchangeOne ? tokenA_amount / price : tokenA_amount;
    const priceImpact = parseFloat(
      (result.priceImpactPct * Math.pow(10, 2)).toFixed(4)
    );

    for (let i = 0; i < 4; i++) {
      if (isExchangeOne) {
        updateBuyData(
          token.id,
          convertAndFormat(price),
          parseFloat(volume.toFixed(4)),
          i,
          calculatePriceImpact(token.amount, priceImpact),
          priceImpact,

        );
        updatePriceImpactVolume(
          token.stockB + token.stockA + token.currency,
          parseInt(volume)
        );
      } else {
        updateSellData(
          token.id,
          convertAndFormat(price),
          parseFloat(volume.toFixed(4)),
          i,
          calculatePriceImpact(token.amount, priceImpact, price),
          priceImpact,
      
        );
      }
    }
  }
};

export const JupiterPriceA = async () => {
  try {
    setTimeout(() => {
      JupiterPriceA()
    }, 1000);
    let data = dataStore.filter((item) => item.stockA === "Jupiter");
    await Promise.allSettled(data.map((token) => processToken(token, true)));
  } catch (error) {}
};

export const JupiterPriceB = async () => {
  try {
    setTimeout(() => {
      JupiterPriceB()
    }, 1000);
    let data = dataStore.filter((item) => item.stockB === "Jupiter");
    await Promise.allSettled(data.map((token) => processToken(token, false)));
  } catch (error) {}
};


const quote_api = async (tokenA, tokenA_decimal, tokenA_amount, tokenB,slippage) => {
  try {
    const amount = tokenA_amount * Math.pow(10, tokenA_decimal);
    const response = await fetch(
      `${JUP_URI}${tokenA}&outputMint=${tokenB}&amount=${amount}${JUP_URI_END}&slippageBps=${slippage===undefined ? "50":slippage}`,
      { agent: proxyAgent }
    );
    
    if (response.status === 200) {
      const data = await response.json();
      const dataString = JSON.stringify(data);
     /* const dataSize = Buffer.byteLength(dataString, 'utf8');
      if (dataSize > 1024) { // 1KB = 1024 bytes
        console.log(`Response size is larger than 1KB: ${dataSize} bytes`);
        console.log(`Response  ${dataString} `);
      }*/
    
      return data;
    }
  } catch (error) {
  
  }
};

export {quote_api}