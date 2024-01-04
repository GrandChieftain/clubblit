import { cn } from "@/lib/utils"

export default function GrantForm({className}: {className: string}){
    return <iframe className={cn("airtable-embed", className)} src="https://airtable.com/embed/appIxMxOL4vfruJCW/shrKDc4YqKuJAr3u3?backgroundColor=purple" width="100%" height="533" style={{background: "transparent", border: "none"}} />
}