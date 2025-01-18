import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addToFavourites,
  getAllUsers,
  getUser,
  login,
  logout,
  register,
  updateProfile,
} from "../thunks/userThunks";
import { cart, menuItem, paginationInfo, userInfo } from "@/types/types";

interface initialStateInterface {
  loading: boolean;
  error: string | null;
  user: object | null;
  message: string | null;
  cart: cart[];
  sidebar: boolean;
  allUsers: userInfo[];
  pagination: paginationInfo | null;
}

const initialState: initialStateInterface = {
  loading: false,
  error: null,
  user: null,
  message: null,
  cart: (JSON.parse(localStorage.getItem("cart")!) as cart[]) || ([] as cart[]),
  sidebar: true,
  allUsers: [],
  pagination: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    addToCart: (state, action: PayloadAction<menuItem>) => {
      const existingItemIndex = state.cart?.findIndex(
        (cartEntry) => cartEntry.item._id === action.payload._id
      );

      if (existingItemIndex !== undefined && existingItemIndex !== -1) {
        if (state.cart) {
          state.cart[existingItemIndex].quantity += 1;
        }
      } else {
        state.cart?.push({ item: action.payload, quantity: 1 });
      }
    },
    decreaseQuantity: (state, action: PayloadAction<menuItem>) => {
      const existingItemIndex = state.cart?.findIndex(
        (cartEntry) => cartEntry.item._id === action.payload._id
      );

      if (existingItemIndex !== undefined && existingItemIndex !== -1) {
        if (state.cart) {
          state.cart[existingItemIndex].quantity -= 1;
        }
      }

      if (state.cart[existingItemIndex].quantity <= 0) {
        state.cart.splice(existingItemIndex, 1);
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      if (state.cart) {
        state.cart = state.cart.filter(
          (cartEntry) => cartEntry.item._id !== action.payload
        );
      }
    },
    setCart: (state, action: PayloadAction<cart[]>) => {
      state.cart = action.payload;
    },
    emptyCart: (state) => {
      state.cart =
        (JSON.parse(localStorage.getItem("cart")!) as cart[]) || ([] as cart[]);
    },
    toggleSidebar: (state) => {
      state.sidebar = !state.sidebar;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register Cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.message = action.payload.message;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Login Cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.message = action.payload.message;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout Cases
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.message = action.payload.message;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get User Cases
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Profile Cases
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add To Favourites Cases
      .addCase(addToFavourites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToFavourites.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(addToFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.user = null;
      })
      // Get All Users
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.allUsers = [];
      });
  },
});

export const {
  clearError,
  clearMessage,
  addToCart,
  decreaseQuantity,
  removeFromCart,
  setCart,
  emptyCart,
  toggleSidebar,
} = userSlice.actions;

export default userSlice.reducer;
