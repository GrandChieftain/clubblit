"use client"

import { useOrganization } from "@clerk/nextjs";

type Settings = {
    name: string,
    acronym: string,
    contactEmail: string,
    website: string
}

export default function useSettings(){
    const { organization } = useOrganization();
    const publicMetadata = organization?.publicMetadata;

    return { ...publicMetadata } as Settings
}