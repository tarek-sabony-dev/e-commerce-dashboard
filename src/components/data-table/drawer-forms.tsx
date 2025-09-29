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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useIsMobile } from "@/hooks/use-mobile"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { addProduct, Product, updateProduct } from "@/lib/features/products/products-slice"
import { addCategory, Category, selectCategories, updateCategory } from "@/lib/features/categories/categories-slice"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const productFormSchema = z.object({
  imageSnapShot: z.string().min(1, { message: 'image url is required' }),
  product: z.string().min(1, { message: 'Product name is required' }).max(200, { message: 'Product name is too long' }),
  description: z.string().max(1000, { message: 'Description is too long' }),
  price: z.number().positive({ message: 'Price must be > 0' }),
  discountedPrice: z.number().positive({ message: 'Discounted price must be > 0' }),
  stock: z.number().int({ message: 'Stock must be an integer' }).min(0, { message: 'Stock cannot be negative' }),
  category: z.string().min(1, { message: 'Category is required' }).max(100),
})

const categoryFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).max(100, { message: 'Name must be 100 characters or less' }),
})

function ProductForm({ item, trigger }: { item: Product, trigger?: React.ReactNode }){
  const isMobile = useIsMobile()
  const dispatch = useAppDispatch()
  const categories : Category[] = useAppSelector(selectCategories)
  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      imageSnapShot: item.imageSnapshot,
      product: item.product,
      price: item.price,
      description: item.description,
      discountedPrice: item.discountedPrice,
      stock: item.stock,
      category: item.category,
    },
  })

  function onSubmit(values: z.infer<typeof productFormSchema>) {
    // This will be type-safe and validated.
    const productData: Product = {
      id: item.id,
      imageSnapshot: item.imageSnapshot,
      avgRating: item.avgRating,
      ...values,
    }

    // (id === -1) means a new category
    const isNewProduct = item.id === -1
    isNewProduct ? dispatch(addProduct(productData)) : dispatch(updateProduct(productData))
  }

  React.useEffect(() => {
    if (item.id === -1) {
      form.reset()
    }
  }, [item]);

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormField 
                control={form.control}
                name="product"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product description" {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField 
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="19.99$" 
                          {...field}
                          onChange={(e) => field.onChange(z.coerce.number().parse(e.target.value))}    
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField 
                  control={form.control}
                  name="discountedPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discounted Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="15.99$" 
                          {...field}
                          onChange={(e) => field.onChange(z.coerce.number().parse(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField 
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100"
                        {...field}
                        onChange={(e) => field.onChange(z.coerce.number().parse(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger id="category" className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="imageSnapShot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input placeholder="Image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                Submit
              </Button>
              <DrawerClose asChild>
                <Button variant={"destructive"}>
                  Cancel
                </Button>
              </DrawerClose>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function CategoryForm({ item, trigger }: { item: Category, trigger?: React.ReactNode }){
  const isMobile = useIsMobile()
  const dispatch = useAppDispatch()
  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: item.name,
    },
  })

  function onSubmit(values: z.infer<typeof categoryFormSchema>) {
    // This will be type-safe and validated.
    const categoryData: Category = {
      id: item.id,
      ...values,
    }

    // (id === -1) means a new category
    const isNewCategory = item.id === -1
    isNewCategory ? dispatch(addCategory(categoryData)) : dispatch(updateCategory(categoryData))
  }

  React.useEffect(() => {
    if (item.id === -1) {
      form.reset()
    }
  }, [item])

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        {trigger}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.name}</DrawerTitle>
          <DrawerDescription>
            {item.id === -1 ? "Add a new product to the store." : `Editing ${item.name}`}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <Separator />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormField 
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="New category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                Submit
              </Button>
              <DrawerClose asChild>
                <Button variant={"destructive"}>
                  Cancel
                </Button>
              </DrawerClose>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export {
  ProductForm, 
  CategoryForm
}