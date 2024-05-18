"use client"

import { cn } from "@/lib/utils"
import { Badge } from "../ui/badge"
import { useState } from "react"
import { BadgeProps } from "../ui/badge";

export default function ColorBadge({ color, ...props }: Omit<BadgeProps, "style" | "onMouseEnter" | "onMouseLeave"> & { color: string }){
    const [hover, setHover] = useState(false);
    const { className, ...rest } = props;
    let hoverColor = color;
    if (color){
        const rgb = color.slice(4, color.length-1).split(', ');
        rgb[0] = (parseInt(rgb[0])*0.8 + 255*0.2).toString();
        rgb[1] = (parseInt(rgb[1])*0.8 + 255*0.2).toString();
        rgb[2] = (parseInt(rgb[2])*0.8 + 255*0.2).toString();
        hoverColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
    }

    return (
        <Badge style={{ backgroundColor: hover ? hoverColor : color }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className={cn(`text-sm font-medium text-black`, className)} { ...rest } />
    )
}