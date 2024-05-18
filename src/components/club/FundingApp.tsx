"use client"

import { CalendarRange, ChevronsRight, Loader2, Receipt, ScrollText } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import useReceiptLink from "@/hooks/useReceiptLink";

export default function FundingApp({type}: {type: 'semesterly' | 'monthly' | 'receipt'}){
    const { receiptLink } = useReceiptLink();
    return (
        <Alert className="flex gap-2 items-center border-[#E4E4E7] dark:bg-[#19191A] dark:border-[#515152]">
            <div>{type == "semesterly" ? <ScrollText size={64} strokeWidth={1} /> : type == "monthly" ? <CalendarRange size={64} strokeWidth={1} /> : <Receipt size={64} strokeWidth={1} />}</div>
            <div>
                <AlertTitle>{type == "semesterly" ? "Apply for Semesterly Funding!" : type == "monthly" ? "Apply for Monthly Funding!" : "Submit your Event Receipts!"}</AlertTitle>
                <AlertDescription>
                    {type == "semesterly" ? "You should apply if you have a general idea of most expenses that your student organization will incur during this semester. A large majority of the funding will go out during the semesterly funding cycle." : type == "monthly" ? "You should apply if you don’t have a concrete idea of the expenses that your student organization will face for the entire semester or if you throw events that were initially unplanned at the beginning of the semester." : <>By the HUA Constitution, any recipient of HUA funding is required to submit receipts. Please preview the <a className="text-[#0070E0]" href="https://docs.google.com/presentation/d/19HZbHAFBOG6gM184mvnr33Shjb0s-w-n0JRoSzi2T48/edit?usp=sharing" rel="noopener noreferrer" target="_blank">instructions</a> regarding how to do this.</>}
                </AlertDescription>
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button type="button" title="Open form" aria-pressed="false" className="ml-auto rounded bg-[#2c3e50] border-[#2c3e50] hover:bg-[#1a252f] hover:border-[#1a252f] active:bg-[#1a252f] active:border-[#1a252f] text-white focus:shadow-calendar" disabled={type === "receipt" && !receiptLink}><ChevronsRight /></Button>
                </DialogTrigger>
                <DialogContent className="min-w-[1000px] flex items-center p-10">
                    <div className="overflow-hidden h-[calc(533px-24px)] w-full border-[1px] border-solid border-[#ccc]">
                        <div className="relative w-full h-full">
                            <iframe className="absolute z-[60] airtable-embed" src={type === "receipt" && receiptLink ? "https://airtable.com/embed" + receiptLink.slice(20, receiptLink.length) : "https://airtable.com/embed/appIxMxOL4vfruJCW/shrKDc4YqKuJAr3u3?backgroundColor=purple"} width="100%" height="533" style={{background: 'transparent', border: 'none'}} />
                            <Loader2 stroke="#ccc" className="absolute z-50 w-16 h-16 top-[calc(50%-32px)] left-[calc(50%-32px)] animate-spin" />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Alert>
    )
    // Need a way of showing all the receipt links awaiting submission
    //else if (type == "receipt"){
    //    return <></>
    //}
}