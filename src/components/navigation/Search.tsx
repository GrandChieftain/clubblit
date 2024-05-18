"use client"

import { Input } from "@/components/ui/input"
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTheme } from "next-themes"
import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Loader2 } from "lucide-react";
import { Dictionary } from "@/lib/types";
import SearchResults from "./SearchResults";
import { create } from 'zustand'

interface ColorDictionary {
    colors: Dictionary
    setColors: (colors: Dictionary) => void
}

export const useColorDictionary = create<ColorDictionary>()((set) => ({
    colors: {},
    setColors: (colors: Dictionary) => set({ colors })
}))

export default function Search(){
    const { resolvedTheme: theme } = useTheme();

    const [ query, setQuery ] = useState("");
    const [ deferredQuery, setDeferredQuery ] = useState(query);
    const [ isDebouncing, setIsDebouncing ] = useState(false);

    useEffect(() => {
        setIsDebouncing(true);
        const timeout = setTimeout(() => {
            setDeferredQuery(query)
            setIsDebouncing(false);
        }, 500);

        return () => clearTimeout(timeout)

    }, [query])

    const { data: results, isLoading } = useQuery({
        queryKey: ["search", deferredQuery],
        queryFn: async () => {
            const { data: { response } } = await axios.get('/api/search', {
                params: {
                    query: deferredQuery
                }
            });
            return response as {name: string, classification: string}[]
        },
    })

    const [open, setOpen] = useState(false);

    const [ mounted, setMounted ] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted){
      return null
    }

    return (
        <div className="search flex mr-auto w-2/4 items-center relative bg-[#F6F7F8] dark:bg-[#272729] hover:bg-transparent focus-within:bg-transparent dark:hover:bg-transparent dark:focus-within:bg-transparent rounded-full -z-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke={theme == "dark" ? "#C2C2C2" : "#000000"} className="absolute h-7 w-7 left-3 -z-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <Input value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} placeholder="Search organizations..." className="bg-transparent border-[#E4E4E7] hover:border-[#0070E0] focus:border-[#0070E0] dark:border-[#515152] rounded-full dark:text-white indent-9 dark:hover:border-[#C2C2C2] dark:focus:border-[#C2C2C2] ring-offset-transparent focus-visible: ring-transparent focus-visible:ring-0 focus-visible:ring-offset-0" />
            {open && <Card className="absolute flex justify-center w-full top-[calc(100%+10px)] dark:bg-[#19191A] border-[#E4E4E7] dark:border-[#515152]"><CardContent className="w-full p-0 my-2">{isDebouncing || isLoading ? <div className="flex items-center justify-center w-full"><Loader2 stroke="#ccc" className="w-16 h-16 animate-spin" /></div> : results && results.length > 0 ? <SearchResults results={results} /> : <div className="flex items-center justify-center w-full">No organization found.</div>}</CardContent></Card>}
        </div>
    )
}