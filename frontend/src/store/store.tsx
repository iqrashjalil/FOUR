import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import menuSlice from "./slices/menuSlice";
import couponSlice from "./slices/couponSlice";
import orderSlice from "./slices/orderSlice";
export const store = configureStore({
  reducer: {
    users: userSlice,
    menu: menuSlice,
    coupon: couponSlice,
    orders: orderSlice,
  },
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
