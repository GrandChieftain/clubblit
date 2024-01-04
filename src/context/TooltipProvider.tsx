"use client"

import { ReactNode, useEffect, useState } from "react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider as TooltipContext,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

interface ProviderProps extends React.ComponentProps<typeof TooltipContent> {
    children: ReactNode[],
    displayContent?: boolean,
    isButton?: boolean
}

export default function TooltipProvider({children, displayContent, isButton, ...props}: ProviderProps){
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    if (!mounted) return <>{children}</>

    if (typeof displayContent === 'boolean'){
        return (
            <TooltipContext>
                <Tooltip>
                    <TooltipTrigger asChild={isButton}>
                        {children[0]}
                    </TooltipTrigger>
                    {displayContent && <TooltipContent {...props}>
                        {children[1]}
                    </TooltipContent>}
                </Tooltip>
            </TooltipContext>
        )
    }
    else{
        return (
            <TooltipContext>
                <Tooltip>
                    <TooltipTrigger>
                        {children[0]}
                    </TooltipTrigger>
                    <TooltipContent {...props}>
                        {children[1]}
                    </TooltipContent>
                </Tooltip>
            </TooltipContext>
        )
    }
}