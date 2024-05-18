import TooltipProvider from "@/context/TooltipProvider";
import { Circle } from "lucide-react";
import UnofficialStatus from "./UnofficialStatus";
import { getFields } from "@/lib/airtable";
import { auth } from "@clerk/nextjs";
import finId from "@/data/FinanceTeamId";

export default async function FundingStatus(){
    const { orgId } = await auth();
    const fields = orgId === finId ? { 'Eligible': "Yes" } : await getFields();
    if (fields){
        const eligibility = fields['Eligible'] as "Yes" | "No"
        if (eligibility == "Yes"){
            return (
                <TooltipProvider isButton>
                    <Circle strokeWidth={1} size={12} fill="#00FF00" stroke="#00FF00" />
                    <p>Eligible</p>
                </TooltipProvider>
            )
        } 
        else if (eligibility == "No"){
            return (
                <TooltipProvider isButton>
                    <Circle strokeWidth={1} size={12} fill="#EC1A23" stroke="#EC1A23" />
                    <p>Not Eligible</p>
                </TooltipProvider>
            )
        }
    }
    else return <UnofficialStatus />
}