import { auth, clerkClient } from "@clerk/nextjs";
import OfficerAlert from "./OfficerAlert";

export default async function OfficerIntro() {
    const { orgId } = await auth();
    if (orgId){
      const organizationId = orgId as string;
      const status = (await clerkClient.organizations.getOrganization({organizationId})).privateMetadata.status as string;
      const officerId = (await clerkClient.organizations.getOrganization({organizationId})).privateMetadata.officerId as string
      
      if (officerId){
        const { profileImageUrl, imageUrl, firstName, lastName } = await clerkClient.users.getUser(officerId);
        const imageLink = profileImageUrl ? profileImageUrl : imageUrl
        return <OfficerAlert status={status} imageLink={imageLink} name={`${firstName} ${lastName}`} />
      }
      return <OfficerAlert status={status} />
    }
    else return <OfficerAlert status={undefined} />
}
