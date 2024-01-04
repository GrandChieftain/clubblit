import ClubForm from "@/components/forms/ClubForm";
import { auth, clerkClient } from "@clerk/nextjs"
import { redirect } from "next/navigation";

export default async function Create(){
    const { orgId } = await auth();
    if (!orgId){
        redirect("/")
    }
    const organization = await clerkClient.organizations.getOrganization({
        organizationId: orgId
      });
    const airtableId = organization.privateMetadata.airtableId as string | undefined
    if (airtableId){
        redirect("/")
    }
    else{
        return (
            <div className="flex items-center justify-center bg-[#DAE0E6] dark:bg-background h-screen">
                <ClubForm className="w-2/4" />
            </div>
        )
    }
}