import { serverUrl } from "@/serverUrl";
import { errorType, userInfo } from "@/types/types";
import { loginInterface, registerInterface } from "@/types/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Register Thunk
export const register = createAsyncThunk(
  "user/register",
  async (formData: registerInterface, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        `${serverUrl}/api/user/register`,
        formData,
        config
      );
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      const errorType = error as errorType;

      return rejectWithValue(errorType.response.data.message);
    }
  }
);

// Login Thunk
export const login = createAsyncThunk(
  "user/login",
  async (formData: loginInterface, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        `${serverUrl}/api/user/login`,
        formData,
        config
      );
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("isAuthenticated", JSON.stringify(true));
      return data;
    } catch (error) {
      const errorType = error as errorType;

      return rejectWithValue(errorType.response.data.message);
    }
  }
);

// Logout Thunk
export const logout = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        withCredentials: true,
      };
      const { data } = await axios.post(`${serverUrl}/api/user/logout`, config);
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      return data;
    } catch (error) {
      const errorType = error as errorType;

      return rejectWithValue(errorType.response.data.message);
    }
  }
);

// Get User Thunk
export const getUser = createAsyncThunk(
  "user/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        withCredentials: true,
      };
      const { data } = await axios.get(`${serverUrl}/api/user/getuser`, config);

      return data;
    } catch (error) {
      const errorType = error as errorType;
      if (errorType.response.data.success === false) {
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
      }

      return rejectWithValue(errorType.response.data.message);
    }
  }
);

// Update Profile Thunk
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (formData: userInfo, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.patch(
        `${serverUrl}/api/user/updateprofile`,
        formData,
        config
      );
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      const errorType = error as errorType;

      return rejectWithValue(errorType.response.data.message);
    }
  }
);

// Add To favourites Thunk

export const addToFavourites = createAsyncThunk(
  "user/addToFavourites",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/user/additemtofavourites/${id}`,
        {},
        { withCredentials: true }
      );
      return data;
    } catch (error) {
      const errorType = error as errorType;

      return rejectWithValue(errorType.response.data.message);
    }
  }
);

// Get All Users (Admin Only)

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.get(
        `${serverUrl}/api/user/getallusers?page=${page}&limit=${limit}`,
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
