import { cn } from "@/lib/utils";

export default function FormResults({className}: {className?: string}){
    return <iframe className={cn("airtable-embed", className)} src="https://airtable.com/embed/appIxMxOL4vfruJCW/shrxHnjNGf27nth78?backgroundColor=purple&viewControls=on" width="100%" height="533" style={{background: "transparent", border: "none"}} />
}