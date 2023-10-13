"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { useEffect, useState } from "react";
  

export default function Checklist(className?: {className?: string}){
    const schoolMonths = ["September", "October", "November", "December", "January", "February", "March", "April"]
    
    const [ mounted, setMounted ] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted){
        return null
    }

    return(
        <Card className={className?.className + " dark:bg-[#19191A] dark:border-[#515152]"}>
            <CardHeader>
                <CardTitle>Checklist</CardTitle>
                <CardDescription>Track your semesterly and monthly funding</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible>
                    { schoolMonths.map((month, key) => 
                    <AccordionItem value={month} key={key}>
                        <AccordionTrigger>{month}</AccordionTrigger>
                        <AccordionContent>
                            Applying for funding today
                        </AccordionContent>
                    </AccordionItem>) }
                </Accordion>
            </CardContent>
        </Card>
    )
}