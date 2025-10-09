"use server";
import { db } from "@/database/db";
import { and, asc, count, desc, eq, inArray} from "drizzle-orm";
import {
  products,
  categories,
  productCategories,
} from "@/database/schema";
import type { ListedProduct } from "@/types/product";
import { ListProductsParams } from "@/types/product";
import { CategoryWithCount } from "@/types/category";
import { Product } from "@/lib/features/products/products-slice";
import { Category } from "@/lib/features/categories/categories-slice";

export type Img = {
  id: number;
  url: string;
  kind: "thumbnail" | "preview";
  sortOrder: number;
};

export type product = {
  title: string;
  price: string;
  stock: number;
  discountedPrice: string;
  description: string;
  reviewsCount: number;
};

export interface InseartItem {
  product: product;
  categories: { categoryId: number }[];
  images: Omit<Img, "id">[];
}

export interface UpdateItem {
  product: product;
  categories: { categoryId: number }[];
  images: Img[];
}

export async function listProducts(
  params: ListProductsParams = {}
): Promise<ListedProduct[]> {
  try {
    const {
      limit = 10,
      offset = 0,
      categoryIds = [],
      sort = "latest",
    } = params;

    // Validate numeric parameters
    if (limit < 1 || limit > 20) {
      throw new Error("Limit must be between 1 and 20");
    }

    if (offset < 0) {
      throw new Error("Offset must be non-negative");
    }

    // Build orderBy clause
    let orderByClause;
    switch (sort) {
      case "price_asc":
        orderByClause = [asc(products.discountedPrice)];
        break;
      case "price_desc":
        orderByClause = [desc(products.discountedPrice)];
        break;
      case "latest":
        orderByClause = [desc(products.id)];
        break;
      case "oldest":
        orderByClause = [asc(products.id)];
        break;
      default:
        orderByClause = [desc(products.id)];
        break;
    }

    // Build where clause for categories
    let whereClause = undefined;

    if (categoryIds && categoryIds.length > 0) {
      const categoryProducts = await db
        .select({ productId: productCategories.productId })
        .from(productCategories)
        .where(inArray(productCategories.categoryId, categoryIds))
        .catch((error) => {
          throw new Error(
            `Failed to fetch category products: ${error.message}`
          );
        });

      const allowedProductIds = categoryProducts.map((r) => r.productId);

      if (allowedProductIds.length === 0) {
        return [];
      }

      whereClause = inArray(products.id, allowedProductIds);
    }

    const productsWithImages = await db.query.products
      .findMany({
        columns: {
          id: true,
          title: true,
          price: true,
          discountedPrice: true,
          reviewsCount: true,
          description: true,
          imagesArray: true,
        },
        limit: limit,
        offset: offset,
        where: whereClause,
        with: {
          categories: {
            columns: {},
            with: {
              category: {
                columns: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: orderByClause,
      })
      .catch((error) => {
        throw new Error(`Failed to fetch products: ${error.message}`);
      });

    console.log("listProducts called");
    return productsWithImages as ListedProduct[];
  } catch (error) {
    console.error("Error in listProducts:", error);
    return [];
  }
}

export async function insertProduct(items: Product) {
  try {
    // Create imagesArray with primaryImage first, then imageSnapShots
    const imagesArray: { key: string; url: string }[] = [];
    
    // Add primary image first if it exists
    if (items.primaryImage) {
      imagesArray.push({
        key: items.primaryImage.key,
        url: items.primaryImage.url
      });
    }
    
    // Add snapshot images
    if (items.imageSnapShots && items.imageSnapShots.length > 0) {
      items.imageSnapShots.forEach(snapshot => {
        imagesArray.push({
          key: snapshot.key,
          url: snapshot.url
        });
      });
    }

    // Map slice Product -> DB product payload
    const productPayload = {
      title: items.product,
      price: String(items.price),
      discountedPrice: String(items.discountedPrice),
      stock: items.stock,
      description: items.description,
      imagesArray: imagesArray,
      productSlug: items.product.toLowerCase().replace(/\s+/g, "-"),
      reviewsCount: 0, // no reviews yet on creation
    };

    const inserted = await db
      .insert(products)
      .values(productPayload)
      .returning({ id: products.id });

    const productId = inserted[0].id;

    // Category relation (use selected category id)
    await db.insert(productCategories).values({
      productId,
      categoryId: items.category.id,
    });

    return;
  } catch (error) {
    console.error("Error in addProduct:", error);
    return error;
  }
}

export async function DBupdateproduct(items: Product) {
  try {
    // Create imagesArray with primaryImage first, then imageSnapShots
    const imagesArray: { key: string; url: string }[] = [];
    
    // Add primary image first if it exists
    if (items.primaryImage) {
      imagesArray.push({
        key: items.primaryImage.key,
        url: items.primaryImage.url
      });
    }
    
    // Add snapshot images
    if (items.imageSnapShots && items.imageSnapShots.length > 0) {
      items.imageSnapShots.forEach(snapshot => {
        imagesArray.push({
          key: snapshot.key,
          url: snapshot.url
        });
      });
    }

    // Map slice Product -> DB product payload
    const productPayload = {
      title: items.product,
      price: String(items.price),
      discountedPrice: String(items.discountedPrice),
      stock: items.stock,
      description: items.description,
      imagesArray: imagesArray,
      productSlug: items.product.toLowerCase().replace(/\s+/g, "-"),
      reviewsCount: 0, // no reviews yet on creation
    };

    await db
      .update(products)
      .set(productPayload)
      .where(eq(products.id, items.id));
    await db
      .update(productCategories)
      .set({ categoryId: items.category.id })
      .where(and(eq(productCategories.productId, items.id)));

    return;
  } catch (error) {
    console.error("Error in updateProduct:", error);
    return error;
  }
}

export async function deleteProduct(ids: number[]) {
  try {
    await db.delete(products).where(inArray(products.id, ids));
    return;
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    return error;
  }
}

export async function listCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  const rows = await db
    .select({
      id: categories.id,
      name: categories.name,
      img: categories.img,
      productCount: count(productCategories.productId).mapWith(Number),
    })
    .from(categories)
    .leftJoin(
      productCategories,
      eq(categories.id, productCategories.categoryId)
    )
    .groupBy(categories.id, categories.name, categories.img);

  console.log("listCategoriesWithCounts called");
  return rows as CategoryWithCount[];
}

export interface CategoryItem {
  name: string;
  imgUrl: string;
  slug: string;
}

export async function insertCategory(item: Category) {
  try {
    const categoryPayload = {
      name: item.name,
      slug: item.name.toLowerCase().replace(/\s+/g, "-"),
      img: item.img,
    };
    await db.insert(categories).values(categoryPayload);
    return;
  } catch (error) {
    console.error("Error in addCategory:", error);
    return error;
  }
}

export async function DBupdateCategory(item: Category) {
  try {
    const categoryPayload = {
      name: item.name,
      slug: item.name.toLowerCase().replace(/\s+/g, "-"),
      img: item.img,
    };
    await db
      .update(categories)
      .set(categoryPayload)
      .where(eq(categories.id, item.id));
    return;
  } catch (error) {
    console.error("Error in updateCategory:", error);
    return error;
  }
}

export async function deleteCategory(ids: number[]) {
  try {
    // Delete from productCategories junction table first
    await db
      .delete(productCategories)
      .where(inArray(productCategories.categoryId, ids));
    // Then delete the categories themselves
    await db.delete(categories).where(inArray(categories.id, ids));
    return;
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    return error;
  }
}
