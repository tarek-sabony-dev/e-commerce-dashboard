import { ListedProduct } from "@/types/product";
import { Product, ImageObject } from "@/lib/features/products/products-slice";

// Normalizes a single listed product from API to the Product state interface
export function normalizeProduct(listedProduct: ListedProduct): Product {
  // Map imagesArray: first is primary, rest are snapshots
  const first = listedProduct.imagesArray?.[0];
  const primaryImage: ImageObject | null = first
    ? { url: first.url, key: first.key }
    : null;

  const imageSnapShots: ImageObject[] = (listedProduct.imagesArray || [])
    .slice(1)
    .map((img) => ({ url: img.url, key: img.key }));

  // Category placeholder (no categories on ListedProduct type here)
  const category = { id: 0, name: "Uncategorized" };

  return {
    id: listedProduct.id,
    primaryImage,
    imageSnapShots,
    product: listedProduct.title,
    description: listedProduct.description,
    price: parseFloat(listedProduct.price) || 0,
    discountedPrice: parseFloat(listedProduct.discountedPrice) || 0,
    stock: 0,
    avgRating: listedProduct.reviewsCount ?? 0,
    category,
  };
}

// Normalizes an array of listed products to Product state interface
export function normalizeProducts(listedProducts: ListedProduct[]): Product[] {
  return listedProducts.map(normalizeProduct);
}

// Creates an empty product with default values matching the slice structure
export function createEmptyProduct(): Product {
  return {
    id: 0,
    primaryImage: null,
    imageSnapShots: [],
    product: "",
    description: "",
    price: 0,
    discountedPrice: 0,
    stock: 0,
    avgRating: 0,
    category: {id:0, name:""},
  };
}

// Helper function to create ImageObject with proper structure
export function createImageObject(url: string, key?: string, keyPrefix: string = "img"): ImageObject {
  return {
    url,
    key: key ?? `${keyPrefix}-${Date.now()}`,
  };
}

// Helper function to extract all image URLs from a product (both thumbnails and snapshots)
export function extractAllImageUrls(product: Product): string[] {
  const primary = product.primaryImage?.url ? [product.primaryImage.url] : [];
  const snapshotUrls = product.imageSnapShots.map(img => img.url);
  return [...primary, ...snapshotUrls];
}