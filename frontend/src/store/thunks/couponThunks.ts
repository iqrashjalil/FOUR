import { serverUrl } from "@/serverUrl";
import { couponInfo, errorType } from "@/types/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCoupon = createAsyncThunk(
  "coupon/fetchCoupon",
  async (code: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${serverUrl}/api/coupon/fetchcoupon?code=${code}`
      );
      console.log(data);

      return data;
    } catch (error) {
      const errorType = error as errorType;

      return rejectWithValue(errorType.response.data.message);
    }
  }
);

// Get All Coupons (Admin Only)

export const getAllCoupons = createAsyncThunk(
  "coupon/getAllCoupons",
  async (
    { page, limit }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.get(
        `${serverUrl}/api/coupon/getallcoupons?page=${page}&limit=${limit}`,
        {
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      const errorType = error as errorType;

      return rejectWithValue(errorType.response.data.message);
    }
  }
);

// Create Coupon (Admin Only)

export const createCoupon = createAsyncThunk(
  "coupon/createCoupon",
  async (formData: couponInfo, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/coupon/createcoupon`,
        formData,
        {
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      const errorType = error as errorType;

      return rejectWithValue(errorType.response.data.message);
    }
  }
);

// Delete Coupon (Admin Only)

export const deleteCoupon = createAsyncThunk(
  "coupon/deleteCoupon",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `${serverUrl}/api/coupon/deletecoupon/${id}`,
        {
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      const errorType = error as errorType;

      return rejectWithValue(errorType.response.data.message);
    }
  }
);

// Update Coupon (Admin Only)

export const updateCoupon = createAsyncThunk(
  "coupon/updateCoupon",
  async (
    { id, couponEdit }: { id: string; couponEdit: couponInfo },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.patch(
        `${serverUrl}/api/coupon/updatecoupon/${id}`,
        couponEdit,
        {
          withCredentials: true,
        }
      );

      return data;
    } catch (error) {
      const errorType = error as errorType;

      return rejectWithValue(errorType.response.data.message);
    }
  }
);

// Get Coupon Details (Admin Only)

export const getCouponDetails = createAsyncThunk(
  "coupon/getCouponDetails",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${serverUrl}/api/coupon/getcoupondetails/${id}`,
        {
          withCredentials: true,
        }
      );

      return data;
    } catch (error) {
      const errorType = error as errorType;

      return rejectWithValue(errorType.response.data.message);
    }
  }
);
