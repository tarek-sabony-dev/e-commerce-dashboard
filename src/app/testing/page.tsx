"use client"

import { useState } from "react"
import { useAppDispatch } from "@/lib/hooks"
import { addProduct, Product } from "@/lib/features/products/productsSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Testing() {
  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    imageSnapshot: "",
    product: "",
    price: "",
    discountedPrice: "",
    stock: "",
    avgRating: "",
    category: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Generate a new ID (simple increment from existing products)
    const newId = Date.now() // Using timestamp as ID for simplicity
    
    const newProduct: Product = {
      id: newId,
      ...formData,
    }
    
    dispatch(addProduct(newProduct))
    
    // Reset form
    setFormData({
      imageSnapshot: "",
      product: "",
      price: "",
      discountedPrice: "",
      stock: "",
      avgRating: "",
      category: "",
    })
  }

  const handleInputChange = (field: keyof Omit<Product, 'id'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>
            Fill out the form below to add a new product to the store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product">Product Name</Label>
                <Input
                  id="product"
                  value={formData.product}
                  onChange={(e) => handleInputChange('product', e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageSnapshot">Image URL</Label>
              <Input
                id="imageSnapshot"
                value={formData.imageSnapshot}
                onChange={(e) => handleInputChange('imageSnapshot', e.target.value)}
                placeholder="/product-image.png"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="19.99$"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discountedPrice">Discounted Price</Label>
                <Input
                  id="discountedPrice"
                  value={formData.discountedPrice}
                  onChange={(e) => handleInputChange('discountedPrice', e.target.value)}
                  placeholder="15.99$"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                  placeholder="100"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="avgRating">Average Rating</Label>
                <Input
                  id="avgRating"
                  value={formData.avgRating}
                  onChange={(e) => handleInputChange('avgRating', e.target.value)}
                  placeholder="4.5"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Add Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}