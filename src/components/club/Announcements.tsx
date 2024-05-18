import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import Image from "next/image";
import logo from "@/assets/HUA_logo.png"
import { cn } from "@/lib/utils";

export default async function Announcements({ className }: { className?: string }) {
    return (
      <Alert style={{ gridTemplateColumns: "64px 1fr" }} className={cn("grid gap-x-3 h-fit dark:bg-[#19191A] border-[#E4E4E7] dark:border-[#515152]", className)}>
        <div className="flex items-center justify-center w-16 h-16"><Image src={logo} alt="" className="w-16 h-16" /></div>
        <div className="flex flex-col justify-center">
            <AlertTitle className="h-[25.6px] flex items-center">Welcome to Clubblit, the HUA's new club funding portal!</AlertTitle>
            <AlertDescription>
                This is where I plan on posting the latest notifications posted by the treasurers as we keep the clubs up-to-date with the latest changes in the funding cycle throughout the semester.
            </AlertDescription>
        </div>
      </Alert>
    )
}