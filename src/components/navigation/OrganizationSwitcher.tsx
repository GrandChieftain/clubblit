"use client"

import { OrganizationSwitcher as Organization } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import { dark } from '@clerk/themes';
import { useEffect, useState } from "react";

export default function OrganizationSwitcher(){
    const { resolvedTheme: theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);    
    if (!mounted){
        return null
    }

    return(
        <Organization afterCreateOrganizationUrl="/create" afterSelectOrganizationUrl="/" afterLeaveOrganizationUrl="/" hidePersonal={true} 
            appearance={{
                baseTheme: theme == "dark" ? dark : undefined,
                elements: {
                    rootBox: `w-[200px] h-10 flex items-center border border-transparent hover:border-[${theme == "dark" ? "#343536" : "#C2C2C2"}] rounded-md`,
                    organizationSwitcherTrigger: 'w-full h-full rounded-[0.325rem]',
                    organizationPreview: 'gap-2',
                    organizationPreviewAvatarContainer: '',
                    avatarBox: 'w-[38.4px] h-[38.4px] bg-transparent rounded-[0.325rem]',
                    avatarImage: '',
                    organizationPreviewMainIdentifier: '',
                    organizationSwitcherTriggerIcon: 'ml-auto'
                } 
            }}
        />
    ) 
}