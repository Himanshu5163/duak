import { configureStore } from '@reduxjs/toolkit';

// Existing slices
import authReducer from './authSlice';
import settingsReducer from './settingSlice';
import sidebarsReducer from './sidebarSlice';
import ticketListReducer from './ticketListSlice';
import productListReducer from './productListSlice';

// New slices for dependent dropdowns
import stateReducer from './stateSlice';
import districtReducer from './districtSlice';
import cityReducer from './citySlice';
import leadSourceReducer from './leadSourceSlice'; // ✅ import leadSource slice

export default configureStore({
  reducer: {
    auth: authReducer,
    settings: settingsReducer,
    sidebars: sidebarsReducer,
    ticketList: ticketListReducer,
    productList: productListReducer,
    state: stateReducer,
    district: districtReducer,
    city: cityReducer,
    leadSource: leadSourceReducer, // ✅ add leadSource to store
  },
});
