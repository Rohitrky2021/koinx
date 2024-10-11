import { configureStore } from '@reduxjs/toolkit';
// import coinsReducer from './slices/coin/sSlice';
import watchlistReducer from './slices/watchlistSlice';
import coinsReducer from './slices/coinSlice'

const store = configureStore({
  reducer: {
    coins: coinsReducer,
    watchlist: watchlistReducer,
  },
});

export default store;
