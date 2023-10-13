"use client"

import { SignIn } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

export default function LogIn(){
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true),[]);
    if (mounted){
        toast('Please use your Harvard College email. Thank you!', {
            icon: '🙏',
            style: {
                fontWeight: "bold"
            }
          })
        setMounted(false)
    }
    return (
        <div className="flex items-center justify-center h-screen bg-[#DAE0E6]">
            <SignIn />
        </div>
    )
}