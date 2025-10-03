import { createSlice, createSelector } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type ImageObject = {
  url: string
  key: string
}

export interface Product {
  id: number
  thumbnails: ImageObject[]
  imageSnapShots: ImageObject[]
  product: string
  description: string
  price: number
  discountedPrice: number
  stock: number
  avgRating: number
  category: string
}

export interface ProductsState {
  items: Product[]
}

const initialProducts = [
  {
    "id": 1,
    "thumbnails": [
      {
        "key": "initial-thumb-0",
        "url": "https://files.edgestore.dev/mpu0sy1y54lv2h1z/publicImages/_public/cfc9097b-d64a-42f9-a609-0411759d14f1.png"
      }
    ],
    "imageSnapShots": [
      {
        "key": "initial-snap-0",
        "url": "https://files.edgestore.dev/mpu0sy1y54lv2h1z/publicImages/_public/cfc9097b-d64a-42f9-a609-0411759d14f1.png"
      }
    ],
    "product": "Cup",
    "price": 19.99,
    "description": "A nice ceramic cup for your beverages.",
    "discountedPrice": 15.99,
    "stock": 18,
    "avgRating": 4.2,
    "category": "Kithen"
  },
  {
    "id": 2,
    "thumbnails": [
      {
        "key": "initial-thumb-1",
        "url": "https://files.edgestore.dev/mpu0sy1y54lv2h1z/publicImages/_public/4dfa6c3f-b16a-4bf3-9286-b2ee95f9e43e.png"
      }
    ],
    "imageSnapShots": [
      {
        "key": "initial-snap-1",
        "url": "https://files.edgestore.dev/mpu0sy1y54lv2h1z/publicImages/_public/4dfa6c3f-b16a-4bf3-9286-b2ee95f9e43e.png"
      }
    ],
    "product": "T-Shirt",
    "description": "A comfortable cotton t-shirt.",
    "price": 20.99,
    "discountedPrice": 18.99,
    "stock": 9,
    "avgRating": 2.5,
    "category": "Clothing"
  },
  {
    "id": 3,
    "thumbnails": [
      {
        "key": "initial-thumb-2",
        "url": "https://files.edgestore.dev/mpu0sy1y54lv2h1z/publicImages/_public/f585cb20-adcc-41bb-8d3c-130a5bd747bc.png"
      }
    ],
    "imageSnapShots": [
      {
        "key": "initial-thumb-2",
        "url": "https://files.edgestore.dev/mpu0sy1y54lv2h1z/publicImages/_public/f585cb20-adcc-41bb-8d3c-130a5bd747bc.png"
      }
    ],
    "product": "Sofa",
    "description": "A stylish and comfortable sofa.",
    "price": 250,
    "discountedPrice": 222,
    "stock": 14,
    "avgRating": 3.9,
    "category": "Furniture"
  },
]

const initialState: ProductsState = {
  items: [...initialProducts]
}

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      action.payload.id = Date.now() // Assign a new id
      state.items.push(action.payload)
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) {
        // if product found, update it
        state.items[index] = action.payload
      }
    },
    removeProduct: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((p) => p.id !== action.payload)
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload
    },
  },
})

export const { setProducts, addProduct, updateProduct, removeProduct } = productsSlice.actions

export default productsSlice.reducer

// Selectors
const selectProductsState = (state: { products: ProductsState }) => state.products

export const selectProducts = createSelector(
  [selectProductsState],
  (productsState) => productsState.items
)
