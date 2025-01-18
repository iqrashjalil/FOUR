import { createSlice } from "@reduxjs/toolkit";
import {
  createCoupon,
  deleteCoupon,
  fetchCoupon,
  getAllCoupons,
  getCouponDetails,
  updateCoupon,
} from "../thunks/couponThunks";
import { couponInfo, paginationInfo } from "@/types/types";

interface initialStateInterface {
  loading: boolean;
  error: string | null;
  message: string | null;
  coupon: string | null;
  allCoupons: couponInfo[];
  pagination: paginationInfo | null;
  couponDetail: couponInfo | null;
}

const initialState: initialStateInterface = {
  loading: false,
  error: null,
  message: null,
  coupon: null,
  allCoupons: [],
  pagination: null,
  couponDetail: null,
};

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.coupon = action.payload.coupon;
        state.message = action.payload.message;
      })
      .addCase(fetchCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.coupon = null;
        state.message = null;
      })
      // Get All Coupons (Admin Only)
      .addCase(getAllCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allCoupons = action.payload.coupons;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.allCoupons = [];
      })
      // Create Coupon (Admin Only)
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Coupon (Admin Only)
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Coupon (Admin Only)
      .addCase(updateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message;
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Coupon Details (Admin Only)
      .addCase(getCouponDetails.pending, (state) => {
        state.error = null;
      })
      .addCase(getCouponDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.couponDetail = action.payload.coupon;
      })
      .addCase(getCouponDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMessage } = couponSlice.actions;
export default couponSlice.reducer;
