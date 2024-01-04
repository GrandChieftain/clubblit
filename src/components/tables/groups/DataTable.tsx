"use client"
 
import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,

} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

import { useClickAway } from "@uidotdev/usehooks"

import { DropdownMenuSub } from "@radix-ui/react-dropdown-menu"
import { ChevronRight, Loader2, MoreHorizontal, User2, Users2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@clerk/nextjs"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  AlternateTrigger,
} from "@/components/ui/select"
import { Dictionary } from "./GroupList"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { toast } from "react-hot-toast"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Organization } from "./columns"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  officerDict: Dictionary
}

export function DataTable<TData, TValue>({
  columns,
  data: originalData,
  officerDict
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const [data, setData] = React.useState(originalData);
 
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 9
      }
    },
  })
  const initialContextMenu = {
    show: false,
    x: 0,
    y: 0,
  }
  const [ contextMenu, setContextMenu ] = React.useState(initialContextMenu)
  function handleContextMenu(e: MouseEvent){
    e.preventDefault();
    const { pageX, pageY } = e;
    setContextMenu({ show: true, x: pageX, y: pageY });
  }

  const ref = useClickAway<HTMLDivElement>(() => {
    setContextMenu(initialContextMenu);
  });

  const tableRef = React.useRef<HTMLDivElement>(null);

  const { userId, orgRole } = useAuth();
  const [filtered, setFiltered] = React.useState(false)

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: async (updateDict: UpdateDictionary) => {
      const { data } = await axios.patch('/api/group', updateDict);
      return data as string
    },
    onSuccess: () => {
      toast.success("Changes saved successfully!", {
        position: 'bottom-right'
      });
      dispatch({type: 'reset'});
    },
    onError: () => {
      toast.error("Error saving changes. Please try again.", {
        position: 'bottom-right'
      })
    },
  })

  // isUpdating ? document.body.style.cursor = "wait" : document.body.style.cursor = "default"

  const alertRef = React.useRef<HTMLButtonElement>(null);
  const [deleteData, setDeleteData] = React.useState<[number, string] | null>(null)

  const [sorted, setSorted] = React.useState(false)
  if (!sorted){
    table.getColumn("status")?.toggleSorting(true);
    setSorted(true)
  }

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), [])
  
  if (Object.keys(rowSelection).length > 0 && mounted){
    tableRef.current!.oncontextmenu = handleContextMenu;
  }
  else if (mounted){
    tableRef.current!.oncontextmenu = null
  }
  else{
    return null
  }

  const official = <Badge className="bg-[#00FF00] hover:bg-[#00FF00]/80 text-black font-medium group-hover:bg-[#00FF00]/80">Official</Badge>;
  const pending = <Badge className="bg-[#FFFF00] hover:bg-[#FFFF00]/80 text-black font-medium group-hover:bg-[#FFFF00]/80">Pending</Badge>;
  const denied = <Badge className="bg-[#FF0000] hover:bg-[#FF0000]/80 font-medium text-black group-hover:bg-[#FF0000]/80">Denied</Badge>;
  const unofficial = <Badge className="font-medium indent-0">Unofficial</Badge>;

  interface UpdateDictionary {
    [organizationId: string]: [string | undefined, string | undefined]
  }

  interface UpdateAction {
    type: 'status' | 'officer' | 'delete' | 'reset',
    organizationId?: string,
    status?: string,
    officerId?: string
  }

  function reducer(state: UpdateDictionary, action: UpdateAction){
    const updateDict = state;
    const {type, organizationId: id, status, officerId} = action;
    const organizationId = id as string
    switch (type){
      case 'status': {
        if (organizationId in updateDict) return {...updateDict, [organizationId]: [status, updateDict[organizationId][1]]} as UpdateDictionary
        else return {...updateDict, [organizationId]: [status, undefined]} as UpdateDictionary
      }
      case 'officer': {
        if (organizationId in updateDict) return {...updateDict, [organizationId]: [updateDict[organizationId][0], officerId]} as UpdateDictionary
        else return {...updateDict, [organizationId]: [undefined, officerId]} as UpdateDictionary
      }
      case 'delete': {
        return {...updateDict, [organizationId]: ["deleted", undefined]} as UpdateDictionary
      }
      case 'reset': {
        return {}
      }
    }
  }

  const [updateDict, dispatch] = React.useReducer<React.Reducer<UpdateDictionary, UpdateAction>>(reducer, {})

  const officers = Object.entries(officerDict);

  const handleSave = () => mutate(updateDict)

  const removeRow = () => {
    const rowIndex = deleteData![0];
    const setFilterFunc = (oldData: TData[]) =>
      oldData.filter((_row: TData, index: number) => index !== rowIndex);
    setData(setFilterFunc);
    dispatch({type: 'delete', organizationId: deleteData![1]});
    setDeleteData(null)
  }

  const changeStatus = (status: string, rowIndex: number, organizationId: string) => {
    const setMapFunc = (oldData: TData[]) =>
      oldData.map((_row: TData, index: number) => {
        if (index == rowIndex){
          const row = _row as Organization
          row.status = status
          return row as TData
        }
        else return _row
      })
    setData(setMapFunc);
    dispatch({type: 'status', organizationId: organizationId, status: status})
  }

  const changeStatusAll = (status: string) => {
    const organizationIds: string[] = []
    const setMapFunc = (oldData: TData[]) =>
      oldData.map((_row: TData, index: number) => {
        if (index in rowSelection){
          const row = _row as Organization;
          if (row.status){
            row.status = status;
            organizationIds.push(row.id);
          }
          return row as TData
        }
        else return _row
      })
    setData(setMapFunc);
    for (const organizationId of organizationIds) dispatch({type: 'status', organizationId: organizationId, status: status})
  }

  const updateOfficer = (officerId: string, rowIndex: number, organizationId: string) => {
    const setMapFunc = (oldData: TData[]) =>
      oldData.map((_row: TData, index: number) => {
        if (index == rowIndex){
          const row = _row as Organization
          row.officerId = officerId
          return row as TData
        }
        else return _row
      })
    setData(setMapFunc);
    dispatch({type: 'officer', organizationId: organizationId, officerId: officerId})
  }
  
  return (
    <div className="flex flex-col items-center justify-start w-[720px] h-full gap-[15px] mt-[15px]">
      <div className="bg-white dark:bg-[#19191A] border rounded-md border-[#E4E4E7] dark:border-[#515152]" ref={tableRef}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-[#E4E4E7] dark:border-[#515152]">
                {headerGroup.headers.map((header) => {
                  if (header.id == "officerId"){
                    return (
                      <TableHead>
                        <Button 
                          variant="ghost"
                          className="text-black dark:text-white"
                          onClick={() => {
                            !filtered ? table.getColumn("officerId")?.setFilterValue(userId) : table.getColumn("officerId")?.setFilterValue(undefined);
                            setFiltered(!filtered)
                          }}  
                        >
                          Officer
                          {filtered ? <User2 className="w-4 h-4 ml-2" /> : <Users2 className="w-4 h-4 ml-2" />}
                        </Button>
                      </TableHead>
                    )
                  } 
                  return (
                    <TableHead className="p-2 text-black dark:text-white" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => { 
                const organizationId = row.getValue("id") as string;
                const contactEmail = row.getValue("email") as string;
                const status = row.getValue("status") as string;
                const officerId = row.getValue("officerId") as string;
                return ( 
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-[#E4E4E7] dark:border-[#515152]"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className={cn("p-2", {
                        "indent-[15px]": cell.column.id == "status",
                        "indent-[30px]": cell.column.id == "owner"
                      })}>
                        {cell.column.id == "status" ?
                          ( status ?
                              <React.Fragment key={status}>
                                <Select
                                  defaultValue={status}
                                  onValueChange={value => changeStatus(value, row.index, organizationId)}
                                >
                                    <AlternateTrigger className="focus-visible:outline-none group">
                                      <SelectValue />
                                    </AlternateTrigger>
                                    <SelectContent>
                                        <SelectItem value="official">{official}</SelectItem>
                                        <SelectItem value="pending">{pending}</SelectItem>
                                        <SelectItem value="denied">{denied}</SelectItem>
                                    </SelectContent>
                                </Select>
                              </React.Fragment> : unofficial
                            ) : cell.column.id == "officerId" ?
                            (
                              <React.Fragment key={officerId}>
                                <Select 
                                  defaultValue={officerId} 
                                  onValueChange={value => updateOfficer(value, row.index, organizationId)}
                                >
                                    <SelectTrigger className="focus-visible:outline-none dark:bg-[#272729] dark:border-[#515152] w-[141px]" disabled={orgRole == 'admin' || [userId, undefined].includes(officerId) ? false : true}>
                                      <div className="truncate max-w-[100px]"><SelectValue /></div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {officers.map((officer) => 
                                        <SelectItem 
                                          disabled={orgRole != "admin" && userId != officer[0]} 
                                          value={officer[0]}
                                        >
                                          {officer[1]}
                                        </SelectItem>)}
                                    </SelectContent>
                                </Select>
                              </React.Fragment>
                            ) : cell.column.id == "actions" ? 
                            (
                              <>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="w-8 h-8 p-0">
                                      <span className="sr-only">Open menu</span>
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={() => [navigator.clipboard.writeText(contactEmail), toast.success("Copied to clipboard!", { position: "bottom-right" })]}
                                    >
                                      Copy contact email
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => [alertRef.current?.click(), setDeleteData([row.index, organizationId])]}
                                      className="font-medium cursor-pointer text-destructive hover:text-destructive dark:hover:text-destructive"
                                    >
                                      Delete organization
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </>
                            )
                            : flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow className="border-[#E4E4E7] dark:border-[#515152]">
                <TableCell colSpan={columns.length} className="p-2 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="relative flex items-center self-start w-full space-x-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
        <div className="flex-1 text-sm text-muted-foreground text-center -indent-[30px]">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected
        </div>
        <Button
          variant="default"
          size="sm"
          className={cn({
            'hidden': isLoading
          })}
          disabled={Object.keys(updateDict).length == 0 ? true : false}
          onClick={handleSave}
        >
          Save
        </Button>
        <Button disabled className={cn({
            'hidden': !isLoading,
        })}>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving
        </Button>
      </div>
      {contextMenu.show && 
      <DropdownMenu open={true}>
        <DropdownMenuTrigger style={{top: `${contextMenu.y-4}px`, left:`${contextMenu.x+70.8}px`}} className="absolute z-50" />
        <DropdownMenuContent onClick={(e) => e.preventDefault()} ref={ref}>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger asChild>
              <DropdownMenuItem className="flex items-center" onClick={() => {}}><span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00AEDF] via-[#8b2dd1] via-[60%] to-[#EC1A23] font-medium">Change status</span><ChevronRight className="w-4 h-4 ml-1 mt-[1.99px]" /></DropdownMenuItem>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem className="flex justify-center" onClick={() => [changeStatusAll('official'), setContextMenu(initialContextMenu)]}><Badge className="bg-[#00FF00] hover:bg-[#00FF00] text-black font-medium">Official</Badge></DropdownMenuItem>
              <DropdownMenuItem className="flex justify-center" onClick={() => [changeStatusAll('pending'), setContextMenu(initialContextMenu)]}><Badge className="bg-[#FFFF00] hover:bg-[#FFFF00] text-black font-medium">Pending</Badge></DropdownMenuItem>
              <DropdownMenuItem className="flex justify-center" onClick={() => [changeStatusAll('denied'), setContextMenu(initialContextMenu)]}><Badge className="bg-[#FF0000] hover:bg-[#FF0000] text-black font-medium">Denied</Badge></DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>}
      <AlertDialog>
          <AlertDialogTrigger className="hidden" ref={alertRef} />
          <AlertDialogContent>
              <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                  This will permanently delete the organization on the next save.
              </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => setDeleteData(null)}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => removeRow()}
              >
                Continue
              </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}