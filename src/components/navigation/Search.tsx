"use client"

import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react";

export default function Search(){
    const { resolvedTheme: theme } = useTheme();
    
    const [ mounted, setMounted ] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted){
      return null
    }
    
    return (
        <div className="search flex mr-auto w-2/4 items-center relative bg-[#F6F7F8] dark:bg-[#272729] hover:bg-transparent focus-within:bg-transparent dark:hover:bg-transparent dark:focus-within:bg-transparent rounded-full -z-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke={theme == "dark" ? "#C2C2C2" : "#000000"} className="absolute h-7 w-7 left-3 -z-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <Input className="bg-transparent border-[#E4E4E7] hover:border-[#0079D3] focus:border-[#0079D3] dark:border-[#515152] rounded-full dark:text-white indent-9 dark:hover:border-[#C2C2C2] dark:focus:border-[#C2C2C2] ring-offset-transparent focus-visible: ring-transparent focus-visible:ring-0 focus-visible:ring-offset-0" />
        </div>
    )
}