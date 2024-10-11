import { createSlice } from "@reduxjs/toolkit";

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState: [
    {
      id: "bitcoin",
      symbol: "btc",
      name: "Bitcoin",
      image:
        "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400",
      current_price: 66475,
      market_cap: 1311209581819,
      market_cap_rank: 1,
      fully_diluted_valuation: 1395765593174,
      total_volume: 35123174363,
      high_24h: 66791,
      low_24h: 63229,
      price_change_24h: 2686.1,
      price_change_percentage_24h: 4.21094,
      market_cap_change_24h: 52828658390,
      market_cap_change_percentage_24h: 4.19815,
      circulating_supply: 19727812,
      total_supply: 21000000,
      max_supply: 21000000,
      ath: 73738,
      ath_change_percentage: -9.95257,
      ath_date: "2024-03-14T07:10:36.635Z",
      atl: 67.81,
      atl_change_percentage: 97820.80355,
      atl_date: "2013-07-06T00:00:00.000Z",
      roi: null,
      last_updated: "2024-07-19T17:30:09.048Z",
      price_change_percentage_1h_in_currency: 0.1252433955741677,
      price_change_percentage_24h_in_currency: 4.210939521851343,
      price_change_percentage_7d_in_currency: 14.533404089446176,
    },
    {
      id: "ethereum",
      symbol: "eth",
      name: "Ethereum",
      image:
        "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png?1696501628",
      current_price: 3501.22,
      market_cap: 422869602950,
      market_cap_rank: 2,
      fully_diluted_valuation: 422869602950,
      total_volume: 16809876709,
      high_24h: 3515,
      low_24h: 3378.35,
      price_change_24h: 81.03,
      price_change_percentage_24h: 2.36919,
      market_cap_change_24h: 12325261740,
      market_cap_change_percentage_24h: 3.00218,
      circulating_supply: 120224183.733365,
      total_supply: 120224183.733365,
      max_supply: null,
      ath: 4878.26,
      ath_change_percentage: -28.40718,
      ath_date: "2021-11-10T14:24:19.604Z",
      atl: 0.432979,
      atl_change_percentage: 806517.74151,
      atl_date: "2015-10-20T00:00:00.000Z",
      roi: {
        times: 69.35115068368741,
        currency: "btc",
        percentage: 6935.115068368741,
      },
      last_updated: "2024-07-19T17:30:26.466Z",
      price_change_percentage_1h_in_currency: 0.24070910562336087,
      price_change_percentage_24h_in_currency: 2.369192369989403,
      price_change_percentage_7d_in_currency: 11.531321793993705,
    },
    {
      id: "tether",
      symbol: "usdt",
      name: "Tether",
      image:
        "https://coin-images.coingecko.com/coins/images/325/large/Tether.png?1696501661",
      current_price: 0.999536,
      market_cap: 113727831233,
      market_cap_rank: 3,
      fully_diluted_valuation: 113727831233,
      total_volume: 50475715291,
      high_24h: 1.003,
      low_24h: 0.998158,
      price_change_24h: -0.000169431735581815,
      price_change_percentage_24h: -0.01695,
      market_cap_change_24h: 43366266,
      market_cap_change_percentage_24h: 0.03815,
      circulating_supply: 113696229620.945,
      total_supply: 113696229620.945,
      max_supply: null,
      ath: 1.32,
      ath_change_percentage: -24.42285,
      ath_date: "2018-07-24T00:00:00.000Z",
      atl: 0.572521,
      atl_change_percentage: 74.65869,
      atl_date: "2015-03-02T00:00:00.000Z",
      roi: null,
      last_updated: "2024-07-19T17:30:32.725Z",
      price_change_percentage_1h_in_currency: -0.11272314455548235,
      price_change_percentage_24h_in_currency: -0.016948169192465865,
      price_change_percentage_7d_in_currency: -0.019233018081492012,
    },
  ],
  reducers: {
    addToWatchlist: (state, action) => {
      const existingCoin = state.find((coin) => coin.id === action.payload.id);
      if (!existingCoin) {
        state.push(action.payload);
      }
    },
    removeFromWatchlist: (state, action) => {
      return state.filter((coin) => coin.id !== action.payload);
    },
  },
});

export const { addToWatchlist, removeFromWatchlist } = watchlistSlice.actions;

export default watchlistSlice.reducer;
