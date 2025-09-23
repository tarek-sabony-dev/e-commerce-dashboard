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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppSelector } from "@/lib/hooks"
import { Product, selectProducts } from "@/lib/features/products/products-slice"
import { CategoryForm, ProductForm } from "./drawer-forms"
import { productColumns } from "./columns/product-columns"
import { categoryColumns } from "./columns/category-columns"
import { Category, selectCategories } from "@/lib/features/categories/categories-slice"
import TableContent from "./table-content"

export default function DataTable() {
  // Track active tab to optimize data selection
  const [activeTab, setActiveTab] = React.useState("products")
  
  // Only select data when the relevant tab is active
  const products : Product[] = useAppSelector(selectProducts)
  const categories : Category[] = useAppSelector(selectCategories)
  
  const [productsData, setProductsData] = React.useState<Product[]>([])
  const [categoriesData, setCategoriesData] = React.useState<Category[]>([])
  
  // Sync local data with Redux store when products change (only if products tab is active)
  React.useEffect(() => {
    if (activeTab === "products") {
      setProductsData(products)
    }
  }, [products, activeTab])

  // Sync local data with Redux store when categories change (only if categories tab is active)
  React.useEffect(() => {
    if (activeTab === "categories") {
      setCategoriesData(categories)
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
    if (value === "products") {
      setProductsData(products)
    } else if (value === "categories") {
      setCategoriesData(categories)
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
          {activeTab === "products" ? 
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
            :
            <CategoryForm
              item={{
                id: -1,
                name: ''
              }}
              trigger={
                <Button variant="outline" size="sm">
                  <IconPlus />
                  <span className="hidden lg:inline">Add Category</span>
                </Button>
              } 
            />
          }
        </div>
      </div>
      <TabsContent
        value="products"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <TableContent table={productsTable} columnCount={productColumns.length} />
      </TabsContent>
      <TabsContent
        value="categories"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <TableContent table={categoriesTable} columnCount={categoryColumns.length} />
      </TabsContent>
    </Tabs>
  )
}
