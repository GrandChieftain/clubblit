"use client"

import { SignUp } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

export default function Register(){
    useEffect(() => {
        const reminder = toast('Please use your Harvard College email. Thank you!', {
            icon: '🙏',
            style: {
                fontWeight: "bold"
            },
            duration: Infinity
          })
        
        return () => toast.dismiss(reminder)

    }, []);

    return (
        <div className="flex items-center justify-center h-screen bg-[#DAE0E6]">
            <SignUp />
        </div>
    )
}