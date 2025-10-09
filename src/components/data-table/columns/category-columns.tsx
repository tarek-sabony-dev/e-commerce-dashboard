import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Category } from "@/lib/features/categories/categories-slice"
import { ArrowUpDown } from "lucide-react"
import { CategoryForm } from "@/components/data-table/drawer-forms"
import ActionsDropdownMenu from "@/components/data-table/actions-dropdown-menu"

export const categoryColumns: ColumnDef<Category>[] = [
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
    accessorKey: "img",
    header: "Image",
    cell: ({ row }) => {
      const img = row.original.img;
      return (
        <div className="w-16 h-16 flex items-center justify-center">
          {img?.url ? (
            <img
              src={img.url}
              alt={row.original.name}
              className="w-12 h-12 object-cover rounded-md border"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-md border flex items-center justify-center text-xs text-gray-500">
              No Image
            </div>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="outline"
          className=""
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown size={16} />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center ">
          <CategoryForm
            item={row.original}
            trigger={
              <Button variant="link" className="text-foreground w-fit px-0 text-left">
                {row.original.name}
              </Button>
            } 
          />
        </div>
      ) 
    },
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex justify-end pr-4">
          <ActionsDropdownMenu table="categories" item={row.original} />
        </div>
      );
    },
    enableHiding: false,
  },
]
