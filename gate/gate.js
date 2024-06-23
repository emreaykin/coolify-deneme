import axios from "axios";

export const gateTokenList = async () => {
  try {
    const response = await axios.get(
      "https://gateapi-64a8abe2a2e5.herokuapp.com/tokens?chainName=SOLANA&deposit_disabled=false&withdraw_disabled=false"
    );
    const data = response.data;

    // currency alanı USDT veya USDC olanları filtrele
    const filteredData = data.filter(token => token.currency !== 'USDT' && token.currency !== 'USDC');

    return filteredData; // Filtrelenmiş veriyi döndür
  } catch (error) {
    console.error("Gate API error:", error);
    return []; // Hata durumunda boş liste döndür
  }
};
