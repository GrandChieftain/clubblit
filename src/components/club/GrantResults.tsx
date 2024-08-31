"use client"

import useGrant from "@/hooks/useGrant"
import { MonthlyGrantParams, SemesterlyGrantParams } from "@/lib/airtable"
import { memo, useEffect, useState } from "react"
import ColorBadge from "./ColorBadge"
import useReceiptLink from "@/hooks/useReceiptLink"
import randomColor from "randomcolor"

const GrantResults = memo(function GrantResults({ params }: { params: Partial<SemesterlyGrantParams | MonthlyGrantParams> }){
    const undefinedBadge = <ColorBadge color="rgb(173, 223, 255)">Undefined</ColorBadge>
    const undefinedValues = <div className="flex justify-around">
        <div className="inline"><span className="font-medium">Status:</span> {undefinedBadge}</div>
        <div className="inline"><span className="font-medium">Officer:</span> {undefinedBadge}</div>
        <div className="inline"><span className="font-medium">Require Interview?</span> {undefinedBadge}</div>
    </div>
    const { data } = useGrant(params);

    const { setReceiptLink } = useReceiptLink();

    useEffect(() => setReceiptLink(data?.receiptLink), [data, setReceiptLink])

    const [color] = useState(randomColor({ luminosity: "light", format: 'rgb'}));

    if (!params["type"] || !params["period"] || !data){
        return undefinedValues
    }
    
    const statuses: Record<string, string> = {
        ["Disbursed"]: "rgb(18, 111, 232)",
        ["Rejected"]: "rgb(255, 0, 0)",
        ["Retracted"]: "rgb(255, 0, 0)",
        ["Approved"]: "rgb(0, 255, 0)",
        ["Supplement Reviewed"]: "rgb(207, 245, 209)",
        ["Under Review"]: "rgb(255, 214, 107)",
        ["Additional Review"]: "rgb(255, 166, 193)",
        ["Flag"]: "rgb(255, 255, 0)"
    }

    return (
        <div className="flex justify-around">
            <div className="inline"><span className="font-medium">Status:</span> <ColorBadge color={statuses[data.status]}>{data.status}</ColorBadge></div>
            <div className="inline"><span className="font-medium">Officer:</span> <ColorBadge color={data.officer ? color : 'rgb(173, 223, 255)'}>{data.officer ?? "Undefined"}</ColorBadge></div>
            <div className="inline"><span className="font-medium">Require Interview?</span> {data.interview === "Yes" ? <ColorBadge color="rgb(0, 255, 0)">Yes</ColorBadge> : <ColorBadge color="rgb(255, 0, 0)">No</ColorBadge>}</div>
        </div>
    )
})

export default GrantResults