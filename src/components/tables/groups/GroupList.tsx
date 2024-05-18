import { DataTable } from "./DataTable";
import { columns, Organization } from "./columns";
import { clerkClient } from "@clerk/nextjs";
import finId from "@/data/FinanceTeamId";
import { cache } from "react";
import { Dictionary } from "@/lib/types";

const getData = cache(async () => {
    // Fetch data from your API here.
    const data = [];
    const organizations = await clerkClient.organizations.getOrganizationList({limit: 500});
    for (const organization of organizations){
      const { id, name: fullName, imageUrl, createdBy: ownerId, privateMetadata: { status: officiality, officerId: financeRepId }, publicMetadata } = organization
      if (id == finId){
        continue
      }
      const status = officiality ? officiality as string : undefined
      const name = publicMetadata?.name ? publicMetadata?.name as string : fullName
      const email = publicMetadata?.contactEmail as string | undefined
      try {
        const { imageUrl: profileImageUrl, emailAddresses, firstName, lastName } = await clerkClient.users.getUser(ownerId)
        const profileName = firstName + " " + lastName
        const emailAddress = emailAddresses[0].emailAddress
        const owner = { profileImageUrl, emailAddress, profileName }
        const officerId = financeRepId as string | undefined
        const organizationData: Organization = {id, imageUrl, name, status, owner, officerId, email}
        data.push(organizationData)
      }
      catch {
        const profileImageUrl = undefined
        const profileName = "Deleted User"
        const emailAddress = undefined
        const owner = { profileImageUrl, emailAddress, profileName }
        const officerId = undefined
        const organizationData: Organization = {id, imageUrl, name, status, owner, officerId, email}
        data.push(organizationData)
      }
    }
    return data
  });
  
  const getOfficerDict = cache(async () => {
    const officerDictionary: Dictionary = {}
    const memberships = await clerkClient.organizations.getOrganizationMembershipList({organizationId: finId});
    memberships.map((member) => {
      const { publicUserData } = member
      const officerId = publicUserData?.userId as string
      officerDictionary[officerId] = `${publicUserData?.firstName} ${publicUserData?.lastName![0]}.`; 
    })
    return officerDictionary
  });

export default async function GroupList(){
    const data = await getData();
    const officerDict = await getOfficerDict();
    if (columns) return <DataTable columns={columns} data={data} officerDict={officerDict} />
}