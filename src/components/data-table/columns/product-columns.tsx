import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown, StarIcon } from "lucide-react"
import Image from "next/image"
import { Product } from "@/lib/features/products/products-slice"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ProductForm } from "@/components/data-table/drawer-forms"
import ActionsDropdownMenu from "@/components/data-table/actions-dropdown-menu"

export const productColumns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="w-12 flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-12 flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "product",
    header: ({ column }) => {
      return (
        <Button
          variant="outline"
          className=""
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product
          <ArrowUpDown size={16} />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-4 ">
          <Image width={56} height={56} src={row.original.imageSnapshot} alt="product-snapshot" className="rounded-lg" /> 
          <ProductForm
            item={row.original}
            trigger={
              <Button variant="link" className="text-foreground w-fit px-0 text-left">
                {row.original.product}
              </Button>
            } 
          />
        </div>
      ) 
    },
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger>
          <div className="w-32 truncate">
            {row.original.description}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="w-fit max-w-64 h-fit flex justify-center items-center">
            {row.original.description}
          </p>
        </TooltipContent>
      </Tooltip>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="outline"
          className=""
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown size={16} />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.price}$ 
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "discountedPrice",
    header: "Discounted Price",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.discountedPrice}$
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.stock}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "avgRating",
    header: "Avg. Rating",
    cell: ({ row }) => (
      <div className="w-32 flex justify-start items-center gap-2">
        <StarIcon size={16} color="gold" fill="gold" />
        {row.original.avgRating}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div className="w-32">
        {row.original.category}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex justify-end pr-4">
          <ActionsDropdownMenu table="products" item={row.original} />
        </div>
      );
    },
    enableHiding: false,
  },
]
