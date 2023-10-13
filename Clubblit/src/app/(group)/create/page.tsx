import GroupForm from "@/components/forms/GroupForm";
import { auth, CreateOrganization, clerkClient } from "@clerk/nextjs"
import { redirect } from "next/navigation";

export default async function Create(){
    const { orgId } = await auth();
    if (orgId == undefined){
        return (
            <div className="flex items-center justify-center h-screen bg-[#DAE0E6]">
                <CreateOrganization afterCreateOrganizationUrl="/create" />
            </div>
        )
    }
    const organizationId = orgId
    const organization = await clerkClient.organizations.getOrganization({
        organizationId
      });
    const status = organization.privateMetadata.status as string | undefined
    if (status){
        redirect("/")
    }
    else{
        return (
            <div className="flex items-center justify-center bg-[#DAE0E6] dark:bg-background h-screen">
                <GroupForm className="w-2/4" />
            </div>
        )
    }
}