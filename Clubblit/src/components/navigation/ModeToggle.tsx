"use client"
 
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import TooltipProvider from "@/context/TooltipProvider"
 
export default function ModeToggle() {
  const { setTheme } = useTheme();

  const [ active, setActive ] = useState(true);
  
  const [ mounted, setMounted ] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted){
    return null
  }

  return (
    <TooltipProvider displayContent={active}>
      <DropdownMenu onOpenChange={() => setActive(false)}>
        <DropdownMenuTrigger asChild onMouseEnter={() => setActive(true)}>
          <Button className="flex items-center justify-center w-7 h-7 ring-offset-transparent focus-visible: ring-transparent focus-visible:ring-0 focus-visible:ring-offset-0" variant="ghost" size="icon">
            <Sun className="w-7 h-7 hover:bg-black/[0.04] hover:border border-transparent transition-all scale-100 rotate-0 dark:-rotate-90 dark:scale-0 rounded-md" stroke="#000000" strokeWidth={1} />
            <Moon className="absolute w-7 h-7 dark:hover:bg-white/[0.04] hover:border border-transparent transition-all scale-0 rotate-90 dark:rotate-0 dark:scale-100 rounded-md" stroke="#C2C2C2" strokeWidth={1} />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <p>Appearance</p>
    </TooltipProvider>
  )
}