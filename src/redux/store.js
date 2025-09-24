import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import settingsReducer from './settingSlice';
import sidebarsReducer from './sidebarSlice';
import ticketListReducer from './ticketListSlice';
import productListReducer from './productListSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    sidebars: sidebarsReducer,
    ticketList: ticketListReducer,
    productList: productListReducer,
  },
});
