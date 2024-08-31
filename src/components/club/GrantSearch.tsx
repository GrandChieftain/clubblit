"use client"

import { useState } from "react";
import { Alert, AlertTitle } from "../ui/alert";
import { MonthlyGrantParams, SemesterlyGrantParams, months } from "@/lib/airtable";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import GrantResults from "./GrantResults";
import compass from "@/assets/compass.png"
import Image from "next/image";

export const defaultValues = {
    type: "semesterly" as const,
    period: "Spring" as const
}

export default function GrantSearch(){
    const [params, setParams] = useState<Partial<SemesterlyGrantParams | MonthlyGrantParams>>(defaultValues);

    // WHEN TYPE CHANGES, CLEARS; PERIOD DEPENDS ON TYPE
    // 1ST COL, ONCHANGE CLEAR 2ND, ONLY RENDER DATA WHEN 2ND DEFINED

    return (
        <Alert className="flex flex-col gap-5 h-fit dark:bg-[#19191A] border-[#E4E4E7] dark:border-[#515152]">
            <div className="flex gap-4 w-full">
                <Image src={compass} className="w-16 h-16 self-end" alt="" />
                <div className="flex flex-col w-[85%] gap-4">
                    <AlertTitle className="text-center font-medium">Funding Status Tracker</AlertTitle>
                    <div className="flex justify-around gap-2">
                        <Select value={params.type} onValueChange={(value) => setParams({
                            type: value as "semesterly" | "monthly",
                            period: undefined
                        })}>
                            <SelectTrigger className="bg-[#F6F7F8] dark:bg-[#272729] placeholder-[#515152] dark:placeholder-[#C2C2C2]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Funding Type</SelectLabel>
                                    <SelectItem value="semesterly">Semesterly Grants</SelectItem>
                                    <SelectItem value="monthly">Monthly Grants</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Select value={params.period} onValueChange={(value) => setParams(params["type"] === "semesterly" ? {
                            type: params["type"],
                            period: value as "Fall" | "Spring"
                        } : {
                            type: params["type"],
                            period: value as typeof months[number]
                        })}>
                            <SelectTrigger className="bg-[#F6F7F8] dark:bg-[#272729] placeholder-[#515152] dark:placeholder-[#C2C2C2]">
                                <SelectValue placeholder="Time Period" />
                            </SelectTrigger>
                            <SelectContent>
                            { params["type"] === "semesterly" ?
                                <SelectGroup>
                                    <SelectLabel>Semester</SelectLabel>
                                    <SelectItem value="Fall">Fall</SelectItem>
                                    <SelectItem value="Spring">Spring</SelectItem>
                                </SelectGroup> :
                                <SelectGroup>
                                    <SelectLabel>Month</SelectLabel>
                                    {months.map((month) => <SelectItem key={month} value={month}>{month}</SelectItem>)}
                                </SelectGroup>
                            }
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            <GrantResults params={params} />
        </Alert>
    )
}