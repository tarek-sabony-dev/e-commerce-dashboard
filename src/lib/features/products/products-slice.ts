import {
  DBupdateproduct,
  deleteProduct,
  InseartItem,
  insertProduct,
  listProducts,
  UpdateItem,
} from "@/actions/actions";
import { ListProductsParams } from "@/types/product";
import { normalizeProducts } from "@/utils/productUtils";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ImageObject = {
  url: string;
  key: string;
};

export interface Product {
  id: number;
  primaryImage: ImageObject | null;
  imageSnapShots: ImageObject[];
  product: string;
  description: string;
  price: number;
  discountedPrice: number;
  stock: number;
  avgRating: number;
  category: {id: number, name: string};
}

export const AysncFetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params: ListProductsParams = {}) => {
    try {
      const response = await listProducts(params);
      return normalizeProducts(response);
    } catch (error) {
      console.error("Error in fetchProducts:", error);
      return [];
    }
  }
);

export const AysncAddProducts = createAsyncThunk(
  "products/addProducts",
  async (items: Product) => {
    try {
      await insertProduct(items);
      return;
    } catch (error) {
      console.error("Error in addProducts:", error);
      return [];
    }
  }
);

export const AysncUpdateProducts = createAsyncThunk(
  "products/updateProducts",
  async (items: Product) => {
    try {
      const response = await DBupdateproduct(items);
      return
    } catch (error) {
      console.error("Error in updateProducts:", error);
      return [];
    }
  }
);

export const AysncDeleteProducts = createAsyncThunk(
  "products/deleteProducts",
  async (ids: number[]) => {
    try {
      const response = await deleteProduct(ids);
      return response; // you should normallize this data to fit your state shape
    } catch (error) {
      console.error("Error in deleteProducts:", error);
      return [];
    }
  }
);

export interface ProductsState {
  items: Product[];
  isLoading: boolean;
  error: string | null;
  addStatus: "idle" | "pending" | "succeeded" | "failed";
  updateStatus: "idle" | "pending" | "succeeded" | "failed";
  removeStatus: "idle" | "pending" | "succeeded" | "failed";
}

// const initialProducts = [
//   {
//     id: 1,
//     thumbnails: [
//       {
//         id:1,
//         key: "initial-thumb-0",
//         url: "/cup.png",
//       },
//     ],
//     imageSnapShots: [
//       {
//         id:11,
//         key: "initial-snap-0",
//         url: "/cup.png",
//       },
//     ],
//     product: "Cup",
//     price: 19.99,
//     description: "A nice ceramic cup for your beverages.",
//     discountedPrice: 15.99,
//     stock: 18,
//     avgRating: 4.2,
//     category: {id:1 , name:"Kithen"},
//   },  
//   {
//     id: 2,
//     thumbnails: [
//       {
//         id:2,
//         key: "initial-thumb-1",
//         url: "/t-shirt.png",
//       },
//     ],
//     imageSnapShots: [
//       {
//         id:22,
//         key: "initial-snap-1",
//         url: "/t-shirt.png",
//       },
//     ],
//     product: "T-Shirt",
//     description: "A comfortable cotton t-shirt.",
//     price: 20.99,
//     discountedPrice: 18.99,
//     stock: 9,
//     avgRating: 2.5,
//     category: {id:22, name:"Clothing"},
//   },
//   {
//     id: 3,
//     thumbnails: [
//       {
//         id:3,
//         key: "initial-thumb-2",
//         url: "/sofa.png",
//       },
//     ],
//     imageSnapShots: [
//       {
//         id:33,
//         key: "initial-thumb-2",
//         url: "/sofa.png",
//       },
//     ],
//     product: "Sofa",
//     description: "A stylish and comfortable sofa.",
//     price: 250,
//     discountedPrice: 222,
//     stock: 14,
//     avgRating: 3.9,
//     category: {id:21, name:"Furniture"},
//   },
// ];

const initialState: ProductsState = {
  items: [],
  isLoading: false,
  error: null,
  addStatus: "idle",
  updateStatus: "idle",
  removeStatus: "idle",
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      action.payload.id = Date.now(); // Assign a new id
      state.items.unshift(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        // if product found, update it
        state.items[index] = action.payload;
      }
    },
    removeProduct: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AysncFetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(AysncFetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload; // you might want to normalize this data
      })
      .addCase(AysncFetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      .addCase(AysncAddProducts.pending, (state) => {
        state.addStatus = "pending";
      })
      .addCase(AysncAddProducts.fulfilled, (state, action) => {
        state.addStatus = "succeeded";
      })
      .addCase(AysncAddProducts.rejected, (state) => {
        state.addStatus = "failed";
      })
      .addCase(AysncUpdateProducts.pending, (state) => {
        state.updateStatus = "pending";
      })
      .addCase(AysncUpdateProducts.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
      })
      .addCase(AysncUpdateProducts.rejected, (state) => {
        state.updateStatus = "failed";
      })
      .addCase(AysncDeleteProducts.pending, (state) => {
        state.removeStatus = "pending";
      })
      .addCase(AysncDeleteProducts.fulfilled, (state, action) => {
        state.removeStatus = "succeeded";
      })
      .addCase(AysncDeleteProducts.rejected, (state) => {
        state.removeStatus = "failed";
      });
  },
});

export const { setProducts, addProduct, updateProduct, removeProduct } =
  productsSlice.actions;

export default productsSlice.reducer;

// Selectors
const selectProductsState = (state: { products: ProductsState }) =>
  state.products;

export const selectProducts = createSelector(
  [selectProductsState],
  (productsState) => productsState.items
);
