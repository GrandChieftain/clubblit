"use client"

import { ReactNode } from "react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider as TooltipContext,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

interface ProviderProps extends React.ComponentProps<typeof TooltipContent> {
    children: ReactNode[],
    displayContent?: boolean
}

export default function TooltipProvider({children, displayContent, ...props}: ProviderProps){
    if (typeof displayContent === 'boolean'){
        return (
            <TooltipContext>
                <Tooltip>
                    <TooltipTrigger>
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