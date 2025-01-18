import { createSlice } from "@reduxjs/toolkit";
import {
  addNewMenuItem,
  deleteMenuItem,
  getAllItems,
  getFullMenu,
  getMenuDetail,
  updateMenuItem,
} from "@/store/thunks/menuThunks";
import { menuItem, menutype, paginationInfo } from "@/types/types";

interface initialStateInterface {
  loading: boolean;
  error: string | null;
  success: boolean;
  allItems: menutype;
  message: string | null;
  fullMenu: menuItem[];
  pagination: paginationInfo | null;
  menuItemDetail: menuItem | null;
}

const initialState: initialStateInterface = {
  loading: false,
  error: null,
  success: false,
  message: null,
  allItems: {},
  fullMenu: [],
  pagination: null,
  menuItemDetail: null,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Menu Items Cases
      .addCase(getAllItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllItems.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.allItems = action.payload.allItems;
      })
      .addCase(getAllItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get All Menu Items Cases
      .addCase(addNewMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(addNewMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Full Menu (Admin Only)
      .addCase(getFullMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFullMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.fullMenu = action.payload.fullMenu;
        state.pagination = action.payload.pagination;
      })
      .addCase(getFullMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Menu Item (Admin Only)
      .addCase(deleteMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(deleteMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Menu Item Detail (Admin Only)
      .addCase(getMenuDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMenuDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.menuItemDetail = action.payload.menuItem;
      })
      .addCase(getMenuDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Menu Item (Admin Only)
      .addCase(updateMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(updateMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearMessage, clearSuccess } = menuSlice.actions;
export default menuSlice.reducer;
