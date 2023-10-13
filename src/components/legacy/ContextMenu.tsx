"use client"

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  
  import { cn } from "@/lib/utils"

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
import { MoreHorizontal } from "lucide-react"
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRef } from "react"
  
export default function RightClick({x, y}: {x: number, y: number}){

    const alertRef = useRef<HTMLButtonElement>(null)

    return (
        <>
            <DropdownMenu defaultOpen>
                <DropdownMenuTrigger />
                <DropdownMenuContent onClick={() => {return}} align="start" className="relative bottom-5">
                <DropdownMenuLabel className="font-semibold">Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => alertRef.current?.click()}
                    className="cursor-pointer text-destructive hover:text-destructive dark:hover:text-destructive"
                >
                    Delete organization
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog>
                <AlertDialogTrigger className="hidden" ref={alertRef} />
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}