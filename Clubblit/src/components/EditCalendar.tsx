"use client"

import { Calendar } from "./ui/calendar"
import React, { useEffect, useState } from "react"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

export default function EventsCalendar(className?: {className?: string}){
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    
    const [ mounted, setMounted ] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted){
        return null
    }

    return (
        <iframe className="airtable-embed" src="https://airtable.com/embed/appIxMxOL4vfruJCW/shrQnSIXhR0Xs8dXO?backgroundColor=purple&viewControls=on" frameBorder="0" width="100%" height="533" style={{background: "transparent", border: "1px solid #ccc"}} />
    )
}
