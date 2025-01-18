import { createSlice } from "@reduxjs/toolkit";
import {
  createOrder,
  getAllOrders,
  getMonthlySales,
  updateOrder,
} from "../thunks/orderThunks";
import { orderInfo, paginationInfo } from "@/types/types";

interface initialStateInterface {
  loading: boolean;
  error: string | null;
  message: string | null;
  success: boolean;
  allOrders: orderInfo[];
  pendingOrders: number;
  pagination: paginationInfo | null;
  monthlySales: number[];
}

const initialState: initialStateInterface = {
  loading: false,
  error: null,
  message: null,
  success: false,
  allOrders: [],
  pendingOrders: 0,
  pagination: null,
  monthlySales: [],
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.message = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allOrders = action.payload.orders;
        state.pendingOrders = action.payload.pendingOrders;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Order
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Montly Sales
      .addCase(getMonthlySales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMonthlySales.fulfilled, (state, action) => {
        state.loading = false;
        state.monthlySales = action.payload.monthlySales;
        state.error = null;
      })
      .addCase(getMonthlySales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
        state.success = action.payload.success;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSuccess, clearMessage, clearError } = orderSlice.actions;
export default orderSlice.reducer;
