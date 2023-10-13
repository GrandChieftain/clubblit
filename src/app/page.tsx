import Checklist from "@/components/legacy/Checklist";
import EventsCalendar from "@/components/EventsCalendar";
import Navbar from "@/components/navigation/Navbar";
import { auth } from "@clerk/nextjs";
import finId from "../data/FinanceTeamId"
import GroupList from "@/components/tables/groups/GroupList";
import { Suspense } from "react";
import OfficerIntro from "@/components/club/OfficerIntro";
import { cn } from "@/lib/utils";
import GrantForm from "@/components/forms/GrantForm";
import FormResults from "@/components/FormResults";

export default async function Home() {
  
  const { orgId } = await auth();
  
  return (
    <div className="min-h-screen bg-[#DAE0E6] dark:bg-background dark:text-white">
      <Navbar />
      <div className="grid grid-cols-2 justify-items-start min-h-[calc(100vh-56px)] gap-5">
        { orgId == finId ? 
          [
            <div className="container h-full overflow-hidden">
              <Suspense fallback={<p>"Loading..."</p>}>
                <GroupList />
              </Suspense>
            </div>,
            <div className="h-[calc(100vh-56px-30px)] overflow-hidden mt-[15px] border-[1px] border-solid border-[#ccc]">
              <FormResults className="w-[720px] h-[calc(100vh-56px-30px+24px)]" />
            </div>
          ]
        : 
          [
            <div className="flex flex-col items-center mt-[15px] gap-[15px] w-[720px] justify-self-end">
              <div className="flex justify-center w-full">
                <OfficerIntro />
              </div>
              <div className="w-full overflow-hidden h-[calc(532px-24px+2px)] border-[1px] border-solid border-[#ccc]">
                <EventsCalendar className="h-[532px]" />
              </div>
            </div>,
            <div className="h-[calc(100vh-56px-30px)] overflow-hidden mt-[15px]">
              <GrantForm className="w-[720px] h-[calc(100vh-56px-30px+24px)]" />
            </div>
          ]
        }
      </div> 
    </div> 
  )
}