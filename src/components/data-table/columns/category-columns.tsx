import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Category } from "@/lib/features/categories/categories-slice"

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
        <div className="flex items-center gap-4 ">
          {/* <Image width={56} height={56} src={row.original.imageSnapshot} alt="product-snapshot" className="rounded-lg" />  */}
          {/* <ProductForm 
            item={row.original}
            trigger={
            } 
          /> */}
              <Button variant="link" className="text-foreground w-fit px-0 text-left">
                {row.original.name}
              </Button>
        </div>
      ) 
    },
    enableHiding: true,
  },
  {
    id: "actions",
    cell: () => {
      return (
        <div>
          dots for actions
        </div>
        // <ActionsDropdownMenu item={row.original} />
      );
    },
  },
]
