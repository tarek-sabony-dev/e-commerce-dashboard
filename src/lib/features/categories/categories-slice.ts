import { CategoryItem, DBupdateCategory, deleteCategory, insertCategory, listCategoriesWithCounts } from '@/actions/actions'
import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Category {
  id: number
  name: string
}

export interface CategoriesState {
  items: Category[]
  isLoading: boolean;
  error: string | null;
  addStatus: "idle" | "pending" | "succeeded" | "failed";
  updateStatus: "idle" | "pending" | "succeeded" | "failed";
  removeStatus: "idle" | "pending" | "succeeded" | "failed";
}

export const AysncFetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    try {
      const response = await listCategoriesWithCounts();
      return response; // you should normallize this data to fit your state shape
    } catch (error) {
      console.error("Error in fetchCategories:", error);
      return [];
    }
  }
);

export const AysncAddCategories = createAsyncThunk(
  "categories/addCategories",
  async (items: CategoryItem) => {
    try {
      const response = await insertCategory(items);
      return response; // you could pick what you want to return
    } catch (error) {
      console.error("Error in addCategories:", error);
      return [];
    }
  }
);

export const AysncUpdateCategories = createAsyncThunk(
  "categories/updateCategories",
  async (items: CategoryItem&{id:number}) => {
    try {
      const response = await DBupdateCategory(items.id, items);
      return response; // you could pick what you want to return
    } catch (error) {
      console.error("Error in updateCategories:", error);
      return [];
    }
  }
);

export const AysncDeleteCategories = createAsyncThunk(
  "categories/deleteCategories",
  async (ids: number[]) => {
    try {
      const response = await deleteCategory(ids);
      return response; // return the deleted id
    } catch (error) {
      console.error("Error in deleteCategories:", error);
      return null;
    }
  }
);

const initialCategories = [
  {
    "id": 1,
    "name": "Electronics"
  },
  {
    "id": 2,
    "name": "Clothing"
  },
  {
    "id": 3,
    "name": "Home & Garden"
  },
  {
    "id": 4,
    "name": "Sports & Outdoors"
  },
  {
    "id": 5,
    "name": "Books"
  },
  {
    "id": 6,
    "name": "Toys & Games"
  },
  {
    "id": 7,
    "name": "Beauty & Personal Care"
  },
  {
    "id": 8,
    "name": "Automotive"
  },
  {
    "id": 9,
    "name": "Food & Beverages"
  },
  {
    "id": 10,
    "name": "Health & Wellness"
  }
]

const initialState: CategoriesState = {
  items: [...initialCategories],
  isLoading: false,
  error: null,
  addStatus: "idle",
  updateStatus: "idle",
  removeStatus: "idle",
}

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<Category>) => {
      action.payload.id = Date.now() // Assign a new id
      state.items.push(action.payload)
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) {
        // if product found, update it
        state.items[index] = action.payload
      }
    },
    removeCategory: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((p) => p.id !== action.payload)
    },
    setCategory: (state, action: PayloadAction<Category[]>) => {
      state.items = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AysncFetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(AysncFetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.items = action.payload; // you might want to normalize this data
      })
      .addCase(AysncFetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch categories";
      })
      .addCase(AysncAddCategories.pending, (state) => {
        state.addStatus = "pending";
      })
      .addCase(AysncAddCategories.fulfilled, (state, action) => {
        state.addStatus = "succeeded";
      })
      .addCase(AysncAddCategories.rejected, (state) => {
        state.addStatus = "failed";
      })
      .addCase(AysncUpdateCategories.pending, (state) => {
        state.updateStatus = "pending";
      })
      .addCase(AysncUpdateCategories.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
      })
      .addCase(AysncUpdateCategories.rejected, (state) => {
        state.updateStatus = "failed";
      })
      .addCase(AysncDeleteCategories.pending, (state) => {
        state.removeStatus = "pending";
      })
      .addCase(AysncDeleteCategories.fulfilled, (state, action) => {
        state.removeStatus = "succeeded";
        if (action.payload) {
          state.items = state.items.filter((p) => p.id !== action.payload);
        }
      })
      .addCase(AysncDeleteCategories.rejected, (state) => {
        state.removeStatus = "failed";
      });
  },
})

export const { setCategory, addCategory, updateCategory, removeCategory } = categoriesSlice.actions

export default categoriesSlice.reducer

// Selectors
const selectCategoriesState = (state: { categories: CategoriesState }) => state.categories

export const selectCategories = createSelector(
  [selectCategoriesState],
  (categoriesState) => categoriesState.items
)
