import {userInfoReducer} from "./reducer/userReducer";
import {combineReducers} from "redux";
import thunk from "redux-thunk";
import {configureStore} from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {persistReducer, persistStore} from "redux-persist";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import {cartInfoReducer} from "./reducer/cartReducer";

const persistConfig = {
  key: "user",
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
  whitelist: ["userInfo", "cartInfo"],
};

const combineReducer = combineReducers({
  userInfo: userInfoReducer,
  cartInfo: cartInfoReducer,
});

const persistedReducer = persistReducer(persistConfig, combineReducer);

const middleware = [thunk];

export const store = configureStore({
  reducer: {
    persist: persistedReducer,
  },
  middleware,
  devTools: true,
});

export const persistor = persistStore(store);
