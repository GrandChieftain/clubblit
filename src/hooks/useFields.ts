"use client"

import { useQuery } from "@tanstack/react-query"
import { FieldSet } from "airtable"
import axios from "axios"

export default function useFields(){
    return useQuery({
        queryKey: ["fields"],
        queryFn: async () => {
            const { data: { response } } = await axios.get('/api/fields')
            return response as FieldSet
        }
    })
}