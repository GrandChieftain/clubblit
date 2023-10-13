"use client"

import TooltipProvider from "@/context/TooltipProvider";
import { useTheme } from "next-themes"
import { useState, useEffect } from "react";

export default function NotificationBell(){
    
    const { resolvedTheme: theme } = useTheme()

    const [ mounted, setMounted ] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted){
      return null
    }

    return (
      <TooltipProvider>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke={theme == "dark" ? "#C2C2C2" : "#000000"} className="h-7 w-7 dark:hover:bg-[#272729] hover:border hover:border-transparent hover:bg-black/[0.04] rounded-md">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        <p>Notifications</p>
      </TooltipProvider>
    )
}