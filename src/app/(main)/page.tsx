import EventsCalendar from "@/components/calendar/EventsCalendar";
import { auth, currentUser } from "@clerk/nextjs";
import finId from "../../data/FinanceTeamId"
import Introduction from "@/components/club/Introduction";
import FundingApp from "@/components/club/FundingApp";
import { StreamChat } from "stream-chat";
import GrantSearch from "@/components/club/GrantSearch";
import Announcements from "@/components/club/Announcements";
import { Suspense } from "react";
import GroupList from "@/components/tables/groups/GroupList";
import Announcer from "@/components/club/Announcer";

export default async function Home() {

  const { orgId } = await auth();
  const user = await currentUser();
  if (user){
    const chatServerClient = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_API_KEY as string, process.env.STREAM_API_SECRET as string);
    await chatServerClient.upsertUser({id: user.id, name: user.firstName + ' ' + user.lastName, image: user.imageUrl});
  }

  return (
    <div className="grid grid-cols-2 justify-items-start min-h-[calc(100vh-56px)] gap-5">
    { orgId === finId ? 
      <>
        <div className="flex flex-col items-center mt-[10px] gap-[10px] w-[720px] justify-self-end">
          <Announcer />
          <div className="box-border w-full p-1 bg-white dark:bg-[#19191A] border-[1px] border-[#E4E4E7] dark:border-[#515152] rounded-md">
            <EventsCalendar />
          </div>
        </div>
        <div className="container h-full overflow-hidden p-0">
          <Suspense fallback={<p>"Loading..."</p>}>
            <GroupList />
          </Suspense>
        </div>
      </>
    : 
      <>
        <div className="flex flex-col items-center mt-[10px] gap-[10px] w-[720px] justify-self-end">
          <Announcements />
          <div className="box-border w-full p-1 bg-white dark:bg-[#19191A] border-[1px] border-[#E4E4E7] dark:border-[#515152] rounded-md">
            <EventsCalendar />
          </div>
        </div>
        <div className="flex flex-col items-center gap-[10px] mt-[10px] w-[720px]">
          <Introduction />
          <GrantSearch />
          <FundingApp type="semesterly" />
          <FundingApp type="monthly" />
          <FundingApp type="receipt" />
        </div>
      </>
    }
    </div>
  )
}