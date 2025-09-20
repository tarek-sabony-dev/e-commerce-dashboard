import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './features/products/products-slice'
import categoriesReducer from './features/categories/categories-slice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      products: productsReducer,
      categories: categoriesReducer,
    },
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']