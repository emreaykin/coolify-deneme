import axios from "axios";


export const jupiterTokenList = async () => {
  try {
    const response = await axios.get(
      "https://jupiterapi-204e2a954f97.herokuapp.com/tokens"
    );
    return response.data; // Veriyi doğrudan döndür
  } catch (error) {
    console.error("Jupiter API error:", error);
    return []; // Hata durumunda boş liste döndür
  }
};