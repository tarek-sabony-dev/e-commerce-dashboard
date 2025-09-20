import { createSlice, createSelector } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Category {
  id: number
  name: string
}

export interface CategoriesState {
  items: Category[]
}

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
  items: [...initialCategories]
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
})

export const { setCategory, addCategory, updateCategory, removeCategory } = categoriesSlice.actions

export default categoriesSlice.reducer

// Selectors
const selectCategoriesState = (state: { categories: CategoriesState }) => state.categories

export const selectCategories = createSelector(
  [selectCategoriesState],
  (categoriesState) => categoriesState.items
)
