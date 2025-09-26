'use client'

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "../ui/label"
import { Product, selectProducts } from "@/lib/features/products/products-slice"
import { Category, selectCategories } from "@/lib/features/categories/categories-slice"
import { useAppSelector } from "@/lib/hooks"
import { productColumns } from "./columns/product-columns"
import DataTable from "./data-table"
import { categoryColumns } from "./columns/category-columns"


export default function TableTaps() {
  const [activeTab, setActiveTab] = React.useState("products")
  const products : Product[] = useAppSelector(selectProducts)
  const categories : Category[] = useAppSelector(selectCategories)
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

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
      </div>
      <TabsContent value="products" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6" >
        <DataTable columns={productColumns} data={products} activeTab={activeTab} />
      </TabsContent>
      <TabsContent value="categories" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6" >
        <DataTable columns={categoryColumns} data={categories} activeTab={activeTab} />
      </TabsContent>
    </Tabs>
  )
}