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
import ProductForm from "./product-form"

export default function ActionsDropdownMenu({ item } : { item: Product }){
  const dispatch = useAppDispatch();
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
        <ProductForm
          item={item} 
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit</DropdownMenuItem>
          }
        />
        <DropdownMenuItem
          onClick={() => {
            const newProduct : Product = {
              ...item,
              id: -1,

            }
            dispatch(addProduct(newProduct))
          }}
        >
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => dispatch(removeProduct(item.id))}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
