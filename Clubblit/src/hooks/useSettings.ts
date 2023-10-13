"use client"

import { useOrganization } from "@clerk/nextjs";
import { genres } from "@/components/forms/GroupForm";
import { z } from "zod";

const zodGenreEnum = z.enum(genres);

type Settings = {
    id: string,
    name: string,
    acronym: string,
    contactEmail: string,
    website: string,
    genre: z.infer<typeof zodGenreEnum>,
}

export default function useSettings(){
    const { organization } = useOrganization();
    const id = organization?.id;
    const publicMetadata = organization?.publicMetadata;

    return {id, ...publicMetadata} as Settings
}