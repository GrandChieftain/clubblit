import finId from "@/data/FinanceTeamId";
import { auth, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

export async function GET(){
    try{
        const chatServerClient = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_API_KEY as string, process.env.STREAM_API_SECRET as string);

        const { userId } = await auth();

        if (userId){
            const token = chatServerClient.createToken(userId);
            const financeTeam = (await clerkClient.organizations.getOrganizationMembershipList({organizationId: finId})).map((membership) => membership.publicUserData?.userId);
            return NextResponse.json({ response: { token: token, financeTeam: financeTeam } }, { status: 200 })
        }
    }
    catch(error){
        console.error(error);
        return new NextResponse("Error querying database.", { status: 500 })
    }
}