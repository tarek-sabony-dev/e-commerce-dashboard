import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Product {
  id: number
  imageSnapshot: string
  product: string
  price: string
  discountedPrice: string
  stock: string
  avgRating: string
  category: string
}

export interface ProductsState {
  items: Product[]
}

const initialState: ProductsState = {
  items: [
    {
      "id": 1,
      "imageSnapshot": "/cup.png",
      "product": "Cup",
      "price": "19.99$",
      "discountedPrice": "15.99$",
      "stock": "18",
      "avgRating": "4.2",
      "category": "Kithen"
    },
    {
      "id": 2,
      "imageSnapshot": "/t-shirt.png",
      "product": "T-Shirt",
      "price": "20.99$",
      "discountedPrice": "18.99$",
      "stock": "9",
      "avgRating": "2.5",
      "category": "Clothing"
    },
    {
      "id": 3,
      "imageSnapshot": "/sofa.png",
      "product": "Sofa",
      "price": "250$",
      "discountedPrice": "222$",
      "stock": "184",
      "avgRating": "3.9",
      "category": "Furniture"
    },
  ]
}

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload)
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    removeProduct: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((p) => p.id !== action.payload)
    },
  },
})

export const { setProducts, addProduct, updateProduct, removeProduct } = productsSlice.actions

export default productsSlice.reducer

// Selectors
export const selectProducts = (state: { products: ProductsState }) => state.products.items

