"use client"

import * as React from "react"

import {
  IconChevronDown,
  IconLayoutColumns,
  IconPlus,
} from "@tabler/icons-react"
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppSelector } from "@/lib/hooks"
import { Product, selectProducts } from "@/lib/features/products/products-slice"
import ProductForm from "./product-form"
import { productColumns } from "./columns/product-columns"
import { categoryColumns } from "./columns/category-columns"
import { Category, selectCategories } from "@/lib/features/categories/categories-slice"
import TableContent from "./table-content"

// Skeleton loading component for table
function TableSkeleton({ columnCount }: { columnCount: number }) {
  return (
    <>
      <div className="overflow-hidden rounded-lg border">
        <div className="bg-muted sticky top-0 z-10">
          <div className="flex">
            {Array.from({ length: columnCount }).map((_, index) => (
              <div key={index} className="flex-1 p-4">
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
        <div className="divide-y">
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex">
              {Array.from({ length: columnCount }).map((_, colIndex) => (
                <div key={colIndex} className="flex-1 p-4">
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between px-4">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </>
  )
}

export default function DataTable() {
  // Track active tab to optimize data selection
  const [activeTab, setActiveTab] = React.useState("products")
  
  // Loading states
  const [isLoadingProducts, setIsLoadingProducts] = React.useState(false)
  const [isLoadingCategories, setIsLoadingCategories] = React.useState(false)
  
  // Only select data when the relevant tab is active
  const products : Product[] = useAppSelector(selectProducts)
  const categories : Category[] = useAppSelector(selectCategories)
  
  const [productsData, setProductsData] = React.useState<Product[]>([])
  const [categoriesData, setCategoriesData] = React.useState<Category[]>([])
  
  // Sync local data with Redux store when products change (only if products tab is active)
  React.useEffect(() => {
    if (activeTab === "products") {
      setIsLoadingProducts(true)
      // Add 2-second delay to simulate data fetching
      const timer = setTimeout(() => {
        setProductsData(products)
        setIsLoadingProducts(false)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [products, activeTab])

  // Sync local data with Redux store when categories change (only if categories tab is active)
  React.useEffect(() => {
    if (activeTab === "categories") {
      setIsLoadingCategories(true)
      // Add 2-second delay to simulate data fetching
      const timer = setTimeout(() => {
        setCategoriesData(categories)
        setIsLoadingCategories(false)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [categories, activeTab])
  
  // Separate states for products and categories tables
  const [productsRowSelection, setProductsRowSelection] = React.useState({})
  const [productsColumnVisibility, setProductsColumnVisibility] = React.useState<VisibilityState>({})
  const [productsColumnFilters, setProductsColumnFilters] = React.useState<ColumnFiltersState>([])
  const [productsSorting, setProductsSorting] = React.useState<SortingState>([])
  const [productsPagination, setProductsPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const [categoriesRowSelection, setCategoriesRowSelection] = React.useState({})
  const [categoriesColumnVisibility, setCategoriesColumnVisibility] = React.useState<VisibilityState>({})
  const [categoriesColumnFilters, setCategoriesColumnFilters] = React.useState<ColumnFiltersState>([])
  const [categoriesSorting, setCategoriesSorting] = React.useState<SortingState>([])
  const [categoriesPagination, setCategoriesPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Trigger loading states when switching tabs
    if (value === "products") {
      setIsLoadingProducts(true)
      setTimeout(() => {
        setProductsData(products)
        setIsLoadingProducts(false)
      }, 2000)
    } else if (value === "categories") {
      setIsLoadingCategories(true)
      setTimeout(() => {
        setCategoriesData(categories)
        setIsLoadingCategories(false)
      }, 2000)
    }
  }

  const productsTable = useReactTable({
    data: productsData,
    columns: productColumns,
    state: {
      sorting: productsSorting,
      columnVisibility: productsColumnVisibility,
      rowSelection: productsRowSelection,
      columnFilters: productsColumnFilters,
      pagination: productsPagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setProductsRowSelection,
    onSortingChange: setProductsSorting,
    onColumnFiltersChange: setProductsColumnFilters,
    onColumnVisibilityChange: setProductsColumnVisibility,
    onPaginationChange: setProductsPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const categoriesTable = useReactTable({
    data: categoriesData,
    columns: categoryColumns,
    state: {
      sorting: categoriesSorting,
      columnVisibility: categoriesColumnVisibility,
      rowSelection: categoriesRowSelection,
      columnFilters: categoriesColumnFilters,
      pagination: categoriesPagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setCategoriesRowSelection,
    onSortingChange: setCategoriesSorting,
    onColumnFiltersChange: setCategoriesColumnFilters,
    onColumnVisibilityChange: setCategoriesColumnVisibility,
    onPaginationChange: setCategoriesPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <Tabs
      defaultValue="products"
      onValueChange={handleTabChange}
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between flex-wrap gap-4 px-4 lg:px-6 ">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 flex">
          <TabsTrigger value="products">
            Products
          </TabsTrigger>
          <TabsTrigger value="categories">
            Categories
          </TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {(activeTab === "products" ? productsTable : categoriesTable)
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <ProductForm
            item={{
              id: -1,
              imageSnapshot: "https://placehold.co/600x400.png",
              product: "",
              description: "",
              price: 0,
              discountedPrice: 0,
              stock: 0,
              avgRating: 0,
              category: "",
            }}
            trigger={
              <Button variant="outline" size="sm">
                <IconPlus />
                <span className="hidden lg:inline">Add Product</span>
              </Button>
            } 
          />
        </div>
      </div>
      <TabsContent
        value="products"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        {isLoadingProducts ? (
          <TableSkeleton columnCount={productColumns.length} />
        ) : (
          <TableContent table={productsTable} columnCount={productColumns.length} />
        )}
      </TabsContent>
      <TabsContent
        value="categories"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        {isLoadingCategories ? (
          <TableSkeleton columnCount={categoryColumns.length} />
        ) : (
          <TableContent table={categoriesTable} columnCount={categoryColumns.length} />
        )}
      </TabsContent>
    </Tabs>
  )
}
