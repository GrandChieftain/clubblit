import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import Image from "next/image";
import logo from "@/assets/HUA_logo.png"
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

export default async function Announcer({ className }: { className?: string }) {
    return (
      <Alert style={{ gridTemplateColumns: "64px 1fr" }} className={cn("grid gap-x-3 h-fit dark:bg-[#19191A] border-[#E4E4E7] dark:border-[#515152]", className)}>
        <div className="flex items-center justify-center w-16 h-16"><Image src={logo} alt="" className="w-16 h-16" /></div>
        <div className="flex flex-col justify-center">
            <AlertTitle className="h-[25.6px] flex items-center">Welcome to Clubblit, the HUA's new club funding portal!</AlertTitle>
            <Input placeholder="Make announcements to all of the clubs on the platform right here!" className="bg-[#F6F7F8] dark:bg-[#272729] text-black dark:text-white placeholder-[#515152] dark:placeholder-[#C2C2C2]" />
        </div>
      </Alert>
    )
}