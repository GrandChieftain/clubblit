"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function GrantForm({className}: {className: string}){
    return <iframe className={cn("airtable-embed", className)} src="https://airtable.com/embed/appIxMxOL4vfruJCW/shrKDc4YqKuJAr3u3?backgroundColor=purple" frameBorder="0" width="100%" height="533" style={{background: "transparent", border: "none"}} />
}