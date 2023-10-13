import TooltipProvider from "@/context/TooltipProvider";
import { auth, clerkClient } from "@clerk/nextjs";
import { Circle } from "lucide-react";
import UnofficialStatus from "./UnofficialStatus";

export default async function OfficialStatus(){
    const { orgId } = await auth();
    if (orgId){
        const organizationId = orgId as string;
        const organization = await clerkClient.organizations.getOrganization({
            organizationId
        });
        const status = organization.privateMetadata.status as string | undefined
        if (status == "pending"){
            return (
                <TooltipProvider>
                    <Circle strokeWidth={1} size={12} fill="#FFFF00" stroke="#FFFF00" />
                    <p>Pending</p>
                </TooltipProvider>
            )
        } 
        else if (status == "official"){
            return (
                <TooltipProvider>
                    <Circle strokeWidth={1} size={12} fill="#00FF00" stroke="#00FF00" />
                    <p>Official</p>
                </TooltipProvider>
            )
        } 
        else if (status == "denied"){
            return (
                <TooltipProvider>
                    <Circle strokeWidth={1} size={12} fill="#FF0000" stroke="#FF0000" />
                    <p>Denied</p>
                </TooltipProvider>
            )
        }
    }
    else return <UnofficialStatus />
}