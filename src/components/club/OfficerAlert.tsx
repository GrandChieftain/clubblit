"use client"

import { Terminal, Waves } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import Image from "next/image"
import logo from '@/assets/clubblit_logo.png'
import { Badge } from "../ui/badge"

export default function OfficerAlert({status, imageLink, name}: {status: string | undefined, imageLink?: string | undefined, name?: string | undefined}){
    const official = <Badge className="bg-[#00FF00] hover:bg-[#00FF00]/80 text-black font-medium group-hover:bg-[#00FF00]/80">Official</Badge>;
    const pending = <Badge className="bg-[#FFFF00] hover:bg-[#FFFF00]/80 text-black font-medium text-sm group-hover:bg-[#FFFF00]/80">Pending</Badge>;
    const denied = <Badge className="bg-[#FF0000] hover:bg-[#FF0000]/80 font-medium text-black text-sm group-hover:bg-[#FF0000]/80">Denied</Badge>;
    return (
        <Alert className="flex gap-2 h-fit dark:bg-[#19191A] dark:border-[#515152]">
            { status == "official" && imageLink && name ?
            <>
                <div className="w-16 h-full flex items-center justify-center"><Image src={imageLink} alt="" width={64} height={64} /></div>
                <div className="flex flex-col">
                    <AlertTitle>What's up!</AlertTitle>
                    <AlertDescription>
                        {`My name is ${name}, and I will be your Finance Team officer for this current funding cycle.`}
                    </AlertDescription>
                </div>
            </> : status == "official" ?
            <>
                <div className="w-16 h-full flex items-center justify-center"><Image src={logo} alt="" width={64} height={64} /></div>
                <div className="flex flex-col">
                    <AlertTitle>Your organization's current status: {official}</AlertTitle>
                    <AlertDescription>
                        An officer will be assigned to your application shortly.
                    </AlertDescription>
                </div>
            </> : status ?
            <>
                <div className="w-16 h-full flex items-center justify-center"><Image src={logo} alt="" width={64} height={64} /></div>
                <div className="flex flex-col">
                    <AlertTitle>Your organization's current status: {status == "pending" ? pending : denied}</AlertTitle>
                    <AlertDescription>
                        {status == "pending" ? "An HUA Finance Team officer will soon verify whether this is an official Harvard student organization." : "Your organization does not appear to be an official one on campus. Contact the HUA Finance Team for any questions."}
                    </AlertDescription>
                </div>
            </> :
            <>
                <div className="w-16 h-full flex items-center justify-center"><Image src={logo} alt="" width={64} height={64} /></div>
                <div className="flex flex-col">
                    <AlertTitle>Welcome to Clubblit!</AlertTitle>
                    <AlertDescription>
                        Create or join an organization to partake in the club funding process!
                    </AlertDescription>
                </div>
            </>
            }
        </Alert>
    )
}