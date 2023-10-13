"use client"

import { SignUp } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function Register(){
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
            <SignUp />
        </div>
    )
}