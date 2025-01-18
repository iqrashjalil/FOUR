import { serverUrl } from "@/serverUrl";
import { errorType, orderInfo } from "@/types/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllOrders = createAsyncThunk(
  "order/getAllOrders",
  async (
    { page, limit }: { page: number; limit: number },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        withCredentials: true,
      };

      const { data } = await axios.get(
        `${serverUrl}/api/order/get/allorders?page=${page}&limit=${limit}`,
        config
      );
      return data;
    } catch (error) {
      const errorType = error as errorType;

      return rejectWithValue(errorType.response.data.message);
    }
  }
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async (
    { id, field, value }: { id: string; field: string; value: string },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        withCredentials: true,
      };

      const { data } = await axios.patch(
        `${serverUrl}/api/order/updateorder/${id}`,
        { [field]: value },
        config
      );
      return data;
    } catch (error) {
      const errorType = error as errorType;

      return rejectWithValue(errorType.response.data.message);
    }
  }
);

export const getMonthlySales = createAsyncThunk(
  "order/getMonthlySales",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        withCredentials: true,
      };

      const { data } = await axios.get(
        `${serverUrl}/api/order/get/monthlysales`,
        config
      );
      return data;
    } catch (error) {
      const errorType = error as errorType;

      return rejectWithValue(errorType.response.data.message);
    }
  }
);

// Create Order

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (formData: orderInfo, { rejectWithValue }) => {
    try {
      const config = {
        withCredentials: true,
      };
      console.log(formData);

      const { data } = await axios.post(
        `${serverUrl}/api/order/createorder`,
        formData,
        config
      );
      return data;
    } catch (error) {
      const errorType = error as errorType;

      return rejectWithValue(errorType.response.data.message);
    }
  }
);
