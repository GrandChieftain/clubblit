"use client"

import { ColumnDef } from "@tanstack/react-table"
import { HelpCircle } from "lucide-react"
 
import { Button } from "@/components/ui/button"

import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"

import TooltipProvider from "@/context/TooltipProvider"

import { Input } from "@/components/ui/input"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Search } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type Organization = {
  id: string;
  logoLink: string;
  name: string;
  status: string | undefined;
  owner: {
    profileLink: string;
    emailAddress: string;
    profileName: string;
  };
  officerId: string | undefined
  email: string | undefined; 
}

export const columns: ColumnDef<Organization>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => column.toggleVisibility(false),
    cell: () => {},
    enableHiding: true
  },
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="mx-[10px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="mx-[10px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "logoLink",
    header: "Logo",
    cell: ({ row }) => {
      const logoLink = row.getValue("logoLink") as string
      return <Image src={logoLink} width={33.41} height={33.41} alt="" />
    }
  },
  {
    accessorKey: "name",
    header: ({ table }) => (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost">
            Name
            <Search className="w-4 h-4 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Input
            placeholder="Search name"
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </PopoverContent>
      </Popover>
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string
      return (
        <TooltipProvider align="start" alignOffset={-12.5}>
          <div className="w-[175px] truncate text-start">{name}</div>
          <p>{name}</p>
        </TooltipProvider>
      )
    }
  },
  {
    accessorKey: "status",
    header: () => (
      <TooltipProvider>
        <Button variant="ghost">
          Status
          <HelpCircle className="w-4 h-4 ml-2" />
        </Button>
        <p className="font-normal">Click on the organization's status to update it.</p>
      </TooltipProvider>
    ),
    enableSorting: true,
    sortUndefined: -1
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      column.toggleVisibility(false)
      /*return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Contact Email
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      )*/
    },
    cell: ({ row }) => {
      /*const email = row.getValue("email") as string
      return (
        <Button 
          variant="ghost"
          className="font-normal"
          onClick={() => [navigator.clipboard.writeText(email), toast.success("Copied to clipboard!", { position: "bottom-right" })]}  
        >
          {email}
        </Button>
      )*/
    },
    enableHiding: true
  },
  {
    accessorKey: "owner",
    header: () => (
      <TooltipProvider>
        <Button variant="ghost">
          Owner
          <HelpCircle className="w-4 h-4 ml-2" />
        </Button>
        <p className="font-normal">Hover over the profile image for contact info.</p>
      </TooltipProvider>
    ),
    cell: ({ row }) => {
      const { profileLink, emailAddress, profileName } = row.getValue("owner") as Organization["owner"]
      return (
        <TooltipProvider>
          <Image src={profileLink} width={33.41} height={33.41} alt="" />
          <div className="indent-0"><span className="underline text-[#0079D3] dark:text-white cursor-pointer" onClick={() => window.location.href = `mailto:${emailAddress}`}>{profileName}</span></div>
        </TooltipProvider>
        )
    }
  },
  {
    accessorKey: "officerId",
  },
  {
    id: "actions",
  },
]