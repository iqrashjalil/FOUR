import { serverUrl } from "@/serverUrl";
import { errorType } from "@/types/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllItems = createAsyncThunk(
  "menu/getAllItems",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${serverUrl}/api/menu/getallmenuitems`,
        config
      );

      return data;
    } catch (error) {
      const errorType = error as errorType;

      return rejectWithValue(errorType.response.data.message);
    }
  }
);

export const addNewMenuItem = createAsyncThunk(
  "menu/addNewMenuItem",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const config = {
        withCredentials: true,
      };
      const { data } = await axios.post(
        `${serverUrl}/api/menu/addmenuitem`,
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

export const getFullMenu = createAsyncThunk(
  "menu/getFullMenu",
  async (
    { page, limit }: { page: number; limit: number },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${serverUrl}/api/menu/getfullmenu?page=${page}&limit=${limit}`,
        config
      );

      return data;
    } catch (error) {
      const errorType = error as errorType;

      return rejectWithValue(errorType.response.data.message);
    }
  }
);

export const deleteMenuItem = createAsyncThunk(
  "menu/deleteMenuItem",
  async (id: string, { rejectWithValue }) => {
    try {
      const config = {
        withCredentials: true,
      };
      const { data } = await axios.delete(
        `${serverUrl}/api/menu/deletemenuitem/${id}`,
        config
      );

      return data;
    } catch (error) {
      const errorType = error as errorType;

      return rejectWithValue(errorType.response.data.message);
    }
  }
);

export const getMenuDetail = createAsyncThunk(
  "menu/getMenuDetail",
  async (id: string, { rejectWithValue }) => {
    try {
      const config = {
        withCredentials: true,
      };
      const { data } = await axios.get(
        `${serverUrl}/api/menu/getsinglemenuitem/${id}`,
        config
      );

      return data;
    } catch (error) {
      const errorType = error as errorType;

      return rejectWithValue(errorType.response.data.message);
    }
  }
);

export const updateMenuItem = createAsyncThunk(
  "menu/updateMenuItem",
  async (
    { id, updatedData }: { id: string; updatedData: FormData },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        withCredentials: true,
      };
      const { data } = await axios.patch(
        `${serverUrl}/api/menu/updatemenuitem/${id}`,
        updatedData,
        config
      );

      return data;
    } catch (error) {
      const errorType = error as errorType;

      return rejectWithValue(errorType.response.data.message);
    }
  }
);
