import type { CategoryWithCount } from "@/types/category";
import type { Category as SliceCategory } from "@/lib/features/categories/categories-slice";

/**
 * Map a single CategoryWithCount to the slice Category shape { id, name }.
 */
export function normalizeCategory(
  item: CategoryWithCount
): SliceCategory {
  return { id: item.id, name: item.name, img: item.img };
}

/**
 * Normalize an array of CategoryWithCount into { id, name } items.
 * Safely handles null/undefined by returning an empty array.
 */
export function normalizeCategories(
  items: CategoryWithCount[] | null | undefined
): SliceCategory[] {
  if (!items || items.length === 0) return [];
  return items.map(normalizeCategory);
}