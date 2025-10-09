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
import { useIsMobile } from "@/lib/hooks/use-mobile"
import { useAppDispatch, useAppSelector } from "@/lib/hooks/hooks"
import { addProduct, AysncAddProducts, AysncUpdateProducts, ImageObject, Product, updateProduct } from "@/lib/features/products/products-slice"
import { addCategory, AysncAddCategories, AysncFetchCategories, AysncUpdateCategories, Category, selectCategories, updateCategory } from "@/lib/features/categories/categories-slice"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEdgeStore } from "@/lib/edgestore/edgestore"
import { UploaderProvider, UploadFn } from "../upload/uploader-provider"
import { ImageUploader } from "../upload/multi-image"

const productFormSchema = z.object({
  primaryImage: z.object({
    key: z.string().min(1, { message: 'Primary image is required' }),
    url: z.string().min(1, { message: 'Primary image is required' }),
  }),
  imageSnapShots: z.array(z.object({
    key: z.string().min(1, { message: 'At least one image is required' }),
    url: z.string().min(1, { message: 'At least one image is required' }),
  })).nonempty({ message: 'At least one snap-shot is required' }),
  product: z.string().min(1, { message: 'Product name is required' }).max(200, { message: 'Product name is too long' }),
  description: z.string().max(1000, { message: 'Description is too long' }),
  price: z.number().positive({ message: 'Price must be > 0' }),
  discountedPrice: z.number().positive({ message: 'Discounted price must be > 0' }),
  stock: z.number().int({ message: 'Stock must be an integer' }).min(0, { message: 'Stock cannot be negative' }),
  category: z.object({
    id: z.number().positive({ message: 'Category id must be > 0' }),
    name: z.string().min(1, { message: 'Category name is required' }).max(100, { message: 'Category name must be 100 characters or less' }),
  }),
})

const categoryFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).max(100, { message: 'Name must be 100 characters or less' }),
  img: z.object({
    key: z.string().min(1, { message: 'Category image is required' }),
    url: z.string().min(1, { message: 'Category image is required' }),
  }),
})

function ProductForm({ item, trigger }: { item: Product, trigger?: React.ReactNode }){
  const dispatch = useAppDispatch()
  const categories : Category[] = useAppSelector(selectCategories)
  const isMobile = useIsMobile()
  const { edgestore } = useEdgeStore()
  
  const [primaryImage, setPrimaryImage] = React.useState<ImageObject | null>(item.primaryImage ?? null)
  const [imageSnapShots, setImageSnapShots] = React.useState<ImageObject[]>(item.imageSnapShots)

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      primaryImage: item.primaryImage ?? { key: "", url: "" },
      imageSnapShots: item.imageSnapShots,
      product: item.product,
      price: item.price,
      description: item.description,
      discountedPrice: item.discountedPrice,
      stock: item.stock,
      category: {id: item.category.id, name: item.category.name},
    },
  })

  async function onSubmit(values: z.infer<typeof productFormSchema>) {
    // confirm upload for each image
    for (const image of values.imageSnapShots) {
      await edgestore.publicImages.confirmUpload({
        url: image.url
      });
    }
    if (values.primaryImage?.url) {
      await edgestore.publicImages.confirmUpload({
        url: values.primaryImage.url
      });
    }

    console.log("submitting", values)
    // This will be type-safe and validated.
    const productData: Product = {
      id: item.id,
      avgRating: item.avgRating,
      ...values,
    }

    // (id === -1) means a new category
    const isNewProduct = item.id === -1
    if (isNewProduct) {
      dispatch(addProduct(productData))
      dispatch(AysncAddProducts(productData))
      dispatch(AysncFetchCategories())
    } else {
      dispatch(updateProduct(productData))
      dispatch(AysncUpdateProducts(productData))
      dispatch(AysncFetchCategories())
    }

    setImageSnapShots(item.imageSnapShots);
    setPrimaryImage(item.primaryImage ?? null);
  }

  // Upload images to edgestore as temporary files
  const uploadFn: UploadFn = React.useCallback(
    async ({ file, onProgressChange, signal }) => {
      const res = await edgestore.publicImages.upload({
        options: {
          temporary: true,
        },
        file,
        signal,
        onProgressChange,
      });

      // you can run some server action or api here to add the necessary data to your database

      return res;
    },
    [edgestore],
  );

  React.useEffect(() => {
    if (item.id === -1) {
      form.reset()
    }
  }, [item]);

  // Sync react-hook-form when adding images
  React.useEffect(() => {
    form.setValue('imageSnapShots', imageSnapShots)
    if (primaryImage) {
      form.setValue('primaryImage', primaryImage)
    }
  }, [imageSnapShots, primaryImage, form])

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
                    <Select
                      value={field.value ? JSON.stringify({ id: field.value.id, name: field.value.name }) : undefined}
                      onValueChange={(val) => {
                        try {
                          const parsed = JSON.parse(val) as { id: number; name: string }
                          if (typeof parsed?.id === 'number' && typeof parsed?.name === 'string') {
                            field.onChange(parsed)
                          }
                        } catch (e) {
                          // ignore invalid values
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger id="category" className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={JSON.stringify({ id: cat.id, name: cat.name })}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between items-start gap-4">
                <FormField
                  control={form.control}
                  name="primaryImage"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Primary image</FormLabel>
                      <FormControl>
                        <div>
                          <Input type="hidden" value={field.value ? JSON.stringify(field.value) : ''} readOnly  />
                          <UploaderProvider
                            uploadFn={uploadFn}
                            autoUpload
                            // reset when form is submitted
                            key={form.formState.isSubmitSuccessful ? 'reset' : 'no-reset'}
                            onFileRemoved={() => {
                              setPrimaryImage(null)
                            }}
                            onUploadCompleted={(res) => {
                              // set single primary
                              if (res?.url && res?.key) {
                                setPrimaryImage({ key: res.key, url: res.url })
                              }
                            }}
                          >
                            <ImageUploader
                              imageListClassName="border-2 border-dashed border-border"
                              maxFiles={1}
                              maxSize={1024 * 1024 * 5} // 5 MB
                            />
                          </UploaderProvider>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imageSnapShots"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Product snap-shots</FormLabel>
                      <FormControl>
                        <div>
                          {/* hidden binding for react-hook-form; actual value is synced via setValue when images are added/removed */}
                          <Input type="hidden" value={Array.isArray(field.value) ? field.value.join(',') : ''} readOnly  />
                          <UploaderProvider
                            uploadFn={uploadFn}
                            autoUpload
                            // reset when form is submitted
                            key={form.formState.isSubmitSuccessful ? 'reset' : 'no-reset'}
                            onFileRemoved={(key) => {
                              // remove from local state
                              setImageSnapShots(prev => {
                                const next = prev.filter(img => img.key !== key)
                                return next
                              })
                            }}
                            onUploadCompleted={(res) => {
                              // add to local state
                              if (res?.url && res?.key) {
                                setImageSnapShots(prev => [...prev, {key: res.key, url: res.url }])
                              }
                            }}
                          >
                            <ImageUploader
                              imageListClassName="border-2 border-dashed border-border"
                              maxFiles={10}
                              maxSize={1024 * 1024 * 5} // 5 MB
                            />
                          </UploaderProvider>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
  const { edgestore } = useEdgeStore()
  
  const [categoryImage, setCategoryImage] = React.useState<{key: string, url: string} | null>(item.img ?? null)
  
  const form = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: item.name,
      img: item.img ?? { key: "", url: "" },
    },
  })

  async function onSubmit(values: z.infer<typeof categoryFormSchema>) {
    // confirm upload for category image
    if (values.img?.url) {
      await edgestore.publicImages.confirmUpload({
        url: values.img.url
      });
    }
    
    console.log("submitting category", values)
    // This will be type-safe and validated.
    const categoryData: Category = {
      id: item.id,
      ...values,
    }

    // (id === -1) means a new category
    const isNewCategory = item.id === -1
    
        if (isNewCategory) {
      dispatch(addCategory(categoryData))
      dispatch(AysncAddCategories(categoryData))
      dispatch(AysncFetchCategories())
    } else {
      dispatch(updateCategory(categoryData))
      dispatch(AysncUpdateCategories(categoryData))
      dispatch(AysncFetchCategories())
    }
  }
  
  // Upload images to edgestore as temporary files
  const uploadFnCategory: UploadFn = React.useCallback(
    async ({ file, onProgressChange, signal }) => {
      const res = await edgestore.publicImages.upload({
        options: {
          temporary: true,
        },
        file,
        signal,
        onProgressChange,
      });
      return res;
    },
    [edgestore],
  );

  React.useEffect(() => {
    if (item.id === -1) {
      form.reset()
      setCategoryImage(null)
    }
  }, [item])
  
  // Sync react-hook-form when adding image
  React.useEffect(() => {
    if (categoryImage) {
      form.setValue('img', categoryImage)
    }
  }, [categoryImage, form])

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
              <FormField
                control={form.control}
                name="img"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Image</FormLabel>
                    <FormControl>
                      <div>
                        <Input type="hidden" value={field.value ? JSON.stringify(field.value) : ''} readOnly  />
                        <UploaderProvider
                          uploadFn={uploadFnCategory}
                          autoUpload
                          // reset when form is submitted
                          key={form.formState.isSubmitSuccessful ? 'reset' : 'no-reset'}
                          onFileRemoved={() => {
                            setCategoryImage(null)
                          }}
                          onUploadCompleted={(res) => {
                            // set category image
                            if (res?.url && res?.key) {
                              setCategoryImage({ key: res.key, url: res.url })
                            }
                          }}
                        >
                          <ImageUploader
                            imageListClassName="border-2 border-dashed border-border"
                            maxFiles={1}
                            maxSize={1024 * 1024 * 5} // 5 MB
                          />
                        </UploaderProvider>
                      </div>
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
