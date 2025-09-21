"use client"

import * as React from "react"
import { IconDotsVertical } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import { useAppDispatch } from "@/lib/hooks"
import { addProduct, Product, removeProduct } from "@/lib/features/products/products-slice"
import { CategoryForm, ProductForm } from "./drawer-forms"
import { addCategory, Category, removeCategory } from "@/lib/features/categories/categories-slice"

export default function ActionsDropdownMenu({ item, table } : { item: Product | Category, table: string }){
  const dispatch = useAppDispatch()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
          size="icon"
        >
          <IconDotsVertical />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {table === "products" ?
          <ProductForm
            item={item as Product}
            trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit</DropdownMenuItem>
            }
          />
          :
          <CategoryForm
            item={item as Category} 
            trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit</DropdownMenuItem>
            }
          />
        }
        {table === "products" ?
          <DropdownMenuItem
            onClick={() => {
              const newProduct : Product = {
                ...(item as Product),
                id: -1,
                
              }
              dispatch(addProduct(newProduct))
            }}
          >
            Duplicate
          </DropdownMenuItem>
          :
          <DropdownMenuItem
            onClick={() => {
              const newCategory : Category = {
                ...(item as Category),
                id: -1,   
              }
              dispatch(addCategory(newCategory))
            }}
          >
            Duplicate
          </DropdownMenuItem>
        }
        <DropdownMenuSeparator />
          {table === "products" ?
          <DropdownMenuItem
            variant="destructive"
            onClick={() => dispatch(removeProduct(item.id))}
          >
            Delete
          </DropdownMenuItem>
          :
          <DropdownMenuItem
            variant="destructive"
            onClick={() => dispatch(removeCategory(item.id))}
          >
            Delete
          </DropdownMenuItem>
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
