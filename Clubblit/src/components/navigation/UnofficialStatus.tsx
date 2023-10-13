"use client"

import TooltipProvider from "@/context/TooltipProvider";
import { Circle } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function UnofficialStatus(){
    const { resolvedTheme: theme } = useTheme();

    const [ mounted, setMounted ] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted){
        return null
    }
    return(
        <TooltipProvider>
            <Circle strokeWidth={1} size={12} fill={theme == "dark" ? "#515152" : "#C2C2C2"} stroke={theme == "dark" ? "#515152" : "#C2C2C2"} />
            <p>Unofficial</p>
        </TooltipProvider>
    )
}