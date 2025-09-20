"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useIsMobile } from "@/hooks/use-mobile"
import { useAppDispatch } from "@/lib/hooks"
import { addProduct, Product, updateProduct } from "@/lib/features/products/productsSlice"

export default function ProductForm({
  item,
  trigger
}: {
  item: Product,
  trigger?: React.ReactNode
}) {
  const isMobile = useIsMobile()
  const dispatch = useAppDispatch()
  const [formData, setFormData] = React.useState<Omit<Product, 'id'>>({
    imageSnapshot: item.imageSnapshot,
    product: item.product,
    price: item.price,
    description: item.description,
    discountedPrice: item.discountedPrice,
    stock: item.stock,
    avgRating: item.avgRating,
    category: item.category,
  })

  React.useEffect(() => {
    setFormData({
      imageSnapshot: item.imageSnapshot,
      product: item.product,
      price: item.price,
      description: item.description,
      discountedPrice: item.discountedPrice,
      stock: item.stock,
      avgRating: item.avgRating,
      category: item.category,
    });
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const productData: Product = {
      id: item.id,
      ...formData,
    }
    
    if (item.id === -1) {
      dispatch(addProduct(productData))
    } else {
      dispatch(updateProduct(productData))
    }

    // Reset form to initial state of the item
    setFormData({
      imageSnapshot: item.imageSnapshot,
      product: item.product,
      price: item.price,
      description: item.description,
      discountedPrice: item.discountedPrice,
      stock: item.stock,
      avgRating: item.avgRating,
      category: item.category,
    })
  }

  const handleInputChange = (field: keyof Omit<Product, 'id'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDrawerClose = () => {
    setFormData({
      imageSnapshot: item.imageSnapshot,
      product: item.product,
      price: item.price,
      description: item.description,
      discountedPrice: item.discountedPrice,
      stock: item.stock,
      avgRating: item.avgRating,
      category: item.category,
    })
  }

  return (
    <Drawer onClose={handleDrawerClose} direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        {trigger}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.product}</DrawerTitle>
          <DrawerDescription>
            {item.id === -1 ? "Add a new product to the store." : `Editing ${item.product}`}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <Separator />
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="product">Product</Label>
              <Input 
                id="product"
                value={formData.product}
                onChange={(e) => handleInputChange('product', e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter product description"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="19.99$"
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="discounted-price">discounted Price</Label>
                <Input
                  id="discounted-price"
                  type="number"
                  value={formData.discountedPrice}
                  onChange={(e) => handleInputChange('discountedPrice', e.target.value)}
                  placeholder="15.99$"
                  required  
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', e.target.value)}
                placeholder="100"
                required
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kitchen">Kitchen</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              value={'Submit'}
              className={"bg-white"}
              disabled={!formData.product || !formData.price|| !formData.discountedPrice || !formData.category || !formData.stock}
            >
              Submit
            </Button>
            <DrawerClose asChild>
              <Button variant={"destructive"}>
                Cancel
              </Button>
            </DrawerClose>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
