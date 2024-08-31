"use client"

import { UserButton as User } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import { dark } from '@clerk/themes';
import { useEffect, useState } from "react";

export default function UserButton(){
    const { resolvedTheme: theme } = useTheme();

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted){
        return null
    }
    
    return(
        <>
            <User afterSignOutUrl="/login" 
                appearance={{
                    baseTheme: theme == "dark" ? dark : undefined,
                    elements: {
                        rootBox: `w-full h-full border border-transparent hover:border-[${theme == "dark" ? "#343536" : "#C2C2C2"}] rounded-md`,
                        userButtonBox: 'w-full h-full',
                        userButtonTrigger: 'w-full h-full rounded-md p-1',
                        avatarBox: "mr-auto",
                        userButtonPopoverCard: ''
                    } 
                }}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute w-5 h-5 right-1" viewBox="0 0 20 20" fill="#515152" stroke="#515152" strokeWidth={0.5}>
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
        </>
    )
}