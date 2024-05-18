"use client"

import { Grant, MonthlyGrantParams, SemesterlyGrantParams } from "@/lib/airtable";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useGrant({ type, period }: Partial<SemesterlyGrantParams | MonthlyGrantParams> ){
    return useQuery({
        queryKey: ["grant", type, period],
        queryFn: async () => {
            if (type && period){
                const { data: { response } } = await axios.get('/api/funding', {
                    params: {
                        type,
                        period
                    }
                })
                return response as Grant
            }
        }
    })
}