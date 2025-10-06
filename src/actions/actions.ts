"use server";
import { db } from "@/database/db";
import { and, asc, count, desc, eq, inArray, SQL, sql } from "drizzle-orm";
import {
  products,
  productImages,
  categories,
  productCategories,
} from "@/database/schema";
import type { ListedProduct } from "@/types/product";
import { ListProductsParams } from "@/types/product";
import { CategoryWithCount } from "@/types/category";

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
          images: {
            columns: {
              url: true,
              kind: true,
            },
            orderBy: (images, { asc }) => [asc(images.sortOrder)],
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

export async function insertProduct(items: InseartItem) {
  try {
    const product = await db
      .insert(products)
      .values(items.product)
      .returning({ id: products.id });
    await db.insert(productCategories).values({
      productId: product[0].id,
      categoryId: items.categories[0].categoryId,
    });
    await db.insert(productImages).values(
      items.images.map((img: Omit<Img, "id">) => ({
        productId: product[0].id,
        url: img.url,
        kind: img.kind,
        sortOrder: img.sortOrder,
      }))
    );

    return;
  } catch (error) {
    console.error("Error in addProduct:", error);
    return error;
  }
}

export async function DBupdateproduct(id: number, items: UpdateItem) {
  try {
    await db.update(products).set(items.product).where(eq(products.id, id));
    await db
      .update(productCategories)
      .set({ categoryId: items.categories[0].categoryId })
      .where(and(eq(productCategories.productId, id)));

    // Update images using CASE statements (single query)
    if (items.images.length > 0) {
      // Build CASE statements for each column
      const urlCaseChunks: SQL[] = [sql`(case`];
      const kindCaseChunks: SQL[] = [sql`(case`];
      const sortOrderCaseChunks: SQL[] = [sql`(case`];
      const imageIds: number[] = [];

      for (const img of items.images) {
        // Use the image ID as the identifier
        urlCaseChunks.push(
          sql`when ${productImages.id} = ${img.id} then ${img.url}`
        );
        kindCaseChunks.push(
          sql`when ${productImages.id} = ${img.id} then ${img.kind}`
        );
        sortOrderCaseChunks.push(
          sql`when ${productImages.id} = ${img.id} then ${img.sortOrder}`
        );
        imageIds.push(img.id);
      }

      urlCaseChunks.push(sql`end)`);
      kindCaseChunks.push(sql`end)`);
      sortOrderCaseChunks.push(sql`end)`);

      const urlCaseSql = sql.join(urlCaseChunks, sql.raw(" "));
      const kindCaseSql = sql.join(kindCaseChunks, sql.raw(" "));
      const sortOrderCaseSql = sql.join(sortOrderCaseChunks, sql.raw(" "));

      await db
        .update(productImages)
        .set({
          url: urlCaseSql,
          kind: kindCaseSql,
          sortOrder: sortOrderCaseSql,
        })
        .where(
          and(
            eq(productImages.productId, id),
            inArray(productImages.id, imageIds)
          )
        );
    }

    return;
  } catch (error) {
    console.error("Error in updateProduct:", error);
    return error;
  }
}

export async function deleteProduct(ids: number[]) {
  try {
    await db.delete(productImages).where(inArray(productImages.productId, ids));
    await db
      .delete(productCategories)
      .where(inArray(productCategories.productId, ids));
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
      imgUrl: categories.imgUrl,
      productCount: count(productCategories.productId).mapWith(Number),
    })
    .from(categories)
    .leftJoin(
      productCategories,
      eq(categories.id, productCategories.categoryId)
    )
    .groupBy(categories.id, categories.name, categories.imgUrl);

  console.log("listCategoriesWithCounts called");
  return rows as CategoryWithCount[];
}

export interface CategoryItem {
  name: string;
  imgUrl: string;
  slug: string;
}

export async function insertCategory(item: CategoryItem) {
  try {
    await db.insert(categories).values(item);
    return;
  } catch (error) {
    console.error("Error in addCategory:", error);
    return error;
  }
}

export async function DBupdateCategory(id: number, item: CategoryItem) {
  try {
    await db.update(categories).set(item).where(eq(categories.id, id));
    return;
  } catch (error) {
    console.error("Error in updateCategory:", error);
    return error;
  }
}

export async function deleteCategory(ids: number[]) {
  try {
    await db.delete(categories).where(inArray(categories.id, ids));
    return;
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    return error;
  }
}
