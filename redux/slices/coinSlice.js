import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const coinsSlice = createSlice({
  name: 'coins',
  initialState: [],
  reducers: {
    setCoins: (state, action) => action.payload,
  },
});

export const { setCoins } = coinsSlice.actions;

export const fetchCoins = (currency, sortBy, coinSearch, page, perPage) => async dispatch => {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
      params: {
        vs_currency: currency,
        ids: coinSearch,
        order: sortBy,
        per_page: perPage,
        page: page,
        sparkline: false,
        price_change_percentage: "1h,24h,7d"
      }
    });
    const data = response.data;
    dispatch(setCoins(data));
  } catch (error) {
    console.error(error);
  }
};

export default coinsSlice.reducer;
