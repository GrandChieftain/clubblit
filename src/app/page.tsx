import EventsCalendar from "@/components/calendar/EventsCalendar";
import Navbar from "@/components/navigation/Navbar";
import { auth } from "@clerk/nextjs";
import finId from "../data/FinanceTeamId"
import GroupList from "@/components/tables/groups/GroupList";
import { Suspense } from "react";
import OfficerIntro from "@/components/club/OfficerIntro";
import { cn } from "@/lib/utils";
import FormResults from "@/components/forms/FormResults";
import FundingApp from "@/components/club/FundingApp";
import ClubCombobox from "@/components/forms/ClubForm";

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
              <div className="box-border w-full p-1 bg-white dark:bg-[#19191A] border-[1px] border-[#E4E4E7] dark:border-[#515152] rounded-md">
                <EventsCalendar />
              </div>
            </div>,
            <div className="flex flex-col items-center gap-[15px] mt-[15px] w-[720px]">
              <div className="w-full h-64 bg-white">Announcements & Messages </div>
              <FundingApp type="semester" />
              <FundingApp type="month" />
              <FundingApp type="receipt" />
            </div>
          ]
        }
      </div>
    </div> 
  )
}