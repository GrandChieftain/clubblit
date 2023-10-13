import { DataTable } from "./DataTable";
import { columns, Organization } from "./columns";
import { clerkClient } from "@clerk/nextjs";
import finId from "@/data/FinanceTeamId";
import { cache } from "react";

const getData = cache(async () => {
    // Fetch data from your API here.
    const data = [];
    const organizations = await clerkClient.organizations.getOrganizationList({limit: 500});
    for (const organization of organizations){
      const { id, name: fullName, logoUrl, imageUrl, createdBy: ownerId, privateMetadata: { status: officiality, officerId: financeRepId }, publicMetadata } = organization
      if (id == finId){
        continue
      }
      const status = officiality ? officiality as string : undefined
      const name = publicMetadata?.name ? publicMetadata?.name as string : fullName
      const email = publicMetadata?.contactEmail as string | undefined
      const logoLink = logoUrl ? logoUrl : imageUrl
      const { profileImageUrl, imageUrl: profileUrl, emailAddresses, firstName, lastName } = await clerkClient.users.getUser(ownerId)
      const profileName = firstName + " " + lastName
      const profileLink = profileImageUrl ? profileImageUrl : profileUrl
      const emailAddress = emailAddresses[0].emailAddress
      const owner = { profileLink, emailAddress, profileName }
      const officerId = financeRepId as string | undefined
      const organizationData: Organization = {id, logoLink, name, status, owner, officerId, email}
      data.push(organizationData)
    }
    return data
  });
  
  export interface Dictionary {
    [key: string]: string
  }
  
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
    return <DataTable columns={columns} data={data} officerDict={officerDict} />
}