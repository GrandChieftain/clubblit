"use client"

import { cn } from "@/lib/utils"

export default function EventsCalendar({className}: {className?: string}){
    return <iframe className={cn("airtable-embed", className)} src="https://airtable.com/embed/appIxMxOL4vfruJCW/shrQnSIXhR0Xs8dXO?backgroundColor=purple" frameBorder="0" width="100%" height="533" style={{background: "transparent", border: "none"}} />
}
