export const utilsWeb3js = (inDecimal, outDecimal, inAmount, outAmount) => {
  if (inDecimal < outDecimal) {
    return outAmount / (inAmount * Math.pow(10, outDecimal - inDecimal));
  }
  if (inDecimal > outDecimal) {
    return outAmount / (inAmount / Math.pow(10, inDecimal - outDecimal));
  }
  if (inDecimal == outDecimal) {
    return outAmount / inAmount;
  }
};

export const convertAndFormat = (num) => {
  try {
    let normalNumber = Number(num).toFixed(15);
    let decimalPart = normalNumber.split(".")[1];
    let zeroCount = 0;
    for (let digit of decimalPart) {
      if (digit === "0") {
        zeroCount++;
      } else {
        break;
      }
    }
    let decimalPlaces = zeroCount + 5;
    let result = Number(num).toFixed(decimalPlaces);

    // remove unnecessary trailing zeros
    result = result.replace(/\.?0+$/, "");
    return result;
  } catch (error) {
   
  }
};


export const calculatePriceImpact = (amount, priceImpact, sellPrice) => {
  let MIN_AMOUNT = 20;
  let MAX_AMOUNT = 2000;

  if (sellPrice) {
    MIN_AMOUNT = parseInt(20 / sellPrice);
    MAX_AMOUNT = parseInt(2000 / sellPrice);
  }

  let changeAmount = 0;

  if (priceImpact < 0.75) {
    changeAmount = Math.round(amount * 0.25);
  } else if (priceImpact > 1.25) {
    changeAmount = -Math.round(amount * 0.25);
  }

  return Math.min(MAX_AMOUNT, Math.max(MIN_AMOUNT, amount + changeAmount));
};

