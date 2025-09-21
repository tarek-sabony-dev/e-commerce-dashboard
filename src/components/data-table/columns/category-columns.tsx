import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Category } from "@/lib/features/categories/categories-slice"
import { CategoryForm } from "../drawer-forms"
import ActionsDropdownMenu from "../actions-dropdown-menu"

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
    accessorKey: "name",
    header: "Category",
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
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          <ActionsDropdownMenu table="categories" item={row.original} />
        </div>
      );
    },
  },
]
