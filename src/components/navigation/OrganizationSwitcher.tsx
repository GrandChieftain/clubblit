"use client"

import { OrganizationSwitcher as Organization, useAuth } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import { dark } from '@clerk/themes';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OrganizationSwitcher(){
    const { resolvedTheme: theme } = useTheme();
    const [ mounted, setMounted ] = useState(false);
    const router = useRouter();
    useEffect(() => setMounted(true), []);
    if (!mounted){
        return null
    }

    function redirectButton(){
        const button = document.querySelector(".cl-organizationSwitcherPreviewButton.cl-internal-11nqe1d") as HTMLButtonElement;
        if (button){
            button.style.display = "none"
        }
    }

    if (theme == "dark"){
        return(
            <div onClick={redirectButton}>
                <Organization afterCreateOrganizationUrl="/create" afterSwitchOrganizationUrl="/" afterLeaveOrganizationUrl="/" hidePersonal={true} 
                    appearance={{
                        baseTheme: dark,
                        elements: {
                            rootBox: 'w-[200px] h-10 flex items-center border border-transparent hover:border-[#343536] rounded-md',
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
            </div>
        )
    }
    else{
        return(
            <Organization afterCreateOrganizationUrl="/create" afterSwitchOrganizationUrl="/" afterLeaveOrganizationUrl="/" hidePersonal={true}
                appearance={{
                    elements: {
                        rootBox: 'w-[200px] h-10 flex items-center border border-transparent hover:border-[#C2C2C2] rounded-md',
                        organizationSwitcherTrigger: 'w-full h-full rounded-[0.325rem] flex justify-start',
                        organizationPreview: 'gap-2 justify-start',
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
}