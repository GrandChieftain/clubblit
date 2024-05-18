import { cn } from "@/lib/utils";

export default function FormResults({className}: {className?: string}){
    return <iframe className={cn("airtable-embed", className)} src="https://airtable.com/embed/appIxMxOL4vfruJCW/shrxHnjNGf27nth78?backgroundColor=purple&viewControls=on" width="100%" height="533" style={{background: "transparent", border: "none"}} />
}

/*<div className="h-[calc(100vh-56px-30px)] overflow-hidden mt-[15px] border-[1px] border-solid border-[#ccc]">
    <FormResults className="w-[720px] h-[calc(100vh-56px-30px+24px)]" />
</div>*/