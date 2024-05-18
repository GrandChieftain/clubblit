"use client"

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface GoogleCalendarEvent {
    title: string;
    start: string;
    end?: string;
    description?: string;
  }
  
interface MyCalendarProps {
    googleCalendarEvents: GoogleCalendarEvent[];
}

const views = {
    // Built-in views
    dayGridMonth: {},
    timeGridWeek: {},
    timeGridDay: {},
    listMonth: { buttonText: 'List' }, // Optional: Customize button text
  };
  

export default function MyCalendar({ googleCalendarEvents }: MyCalendarProps){
    const calendarRef = useRef<FullCalendar|null>(null)

    // const [active, setActive] = useState('dayGridMonth')

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null

    /*const setView = (viewName: string) => {
        if (calendarRef.current) {
          calendarRef.current.getApi().changeView(viewName);
          setActive(viewName)
        }
      };*/

    const renderEventContent = (eventInfo: any) => {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button className="w-full h-full p-0 truncate hover:text-white" variant="ghost">{eventInfo.event.title}</Button>
          </PopoverTrigger>
          <PopoverContent>
            <h1 className="text-lg font-medium">{eventInfo.event.title}</h1>
            <span className="text-sm">{(eventInfo.event.start as Date).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})} to {(eventInfo.event.end as Date).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</span>
            {eventInfo.event.extendedProps.description && <p className="mt-4 text-sm">{eventInfo.event.extendedProps.description}</p>}
          </PopoverContent>
        </Popover>
      );
    }

    return (
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
        initialView="dayGridMonth"
        views={views}
        events={googleCalendarEvents}
        height={500}
        aspectRatio={2}
        eventContent={renderEventContent}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title', // This will display the month name
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        eventOverlap={false}
        slotEventOverlap={false}
        selectOverlap={false}
      />
    );
}

/* 
  <div className='absolute z-[1] hidden'>
    <Button title="Month view" className={cn("rounded-r-none bg-[#2c3e50] border-[#2c3e50] hover:bg-[#1a252f] hover:border-[#1a252f] active:bg-[#1a252f] active:border-[#1a252f] text-white focus:shadow-calendar relative z-0 focus:z-[1]", {
        "bg-[#1a252f]": active == 'dayGridMonth'
    })} onClick={() => setView('dayGridMonth')}>month</Button>
    <Button title="Week view" className={cn("rounded-none bg-[#2c3e50] border-[#2c3e50] hover:bg-[#1a252f] hover:border-[#1a252f] active:bg-[#1a252f] active:border-[#1a252f] text-white focus:shadow-calendar relative z-0 focus:z-[1] ml-[-1px]", {
        "bg-[#1a252f]": active == 'timeGridWeek'
    })} onClick={() => setView('timeGridWeek')}>week</Button>
    <Button title="Day view" className={cn("rounded-none bg-[#2c3e50] border-[#2c3e50] hover:bg-[#1a252f] hover:border-[#1a252f] active:bg-[#1a252f] active:border-[#1a252f] text-white focus:shadow-calendar relative z-0 focus:z-[1] ml-[-1px]", {
        "bg-[#1a252f]": active == 'timeGridDay'
    })} onClick={() => setView('timeGridDay')}>day</Button>
    <Button title="List view" className={cn("rounded-l-none bg-[#2c3e50] border-[#2c3e50] hover:bg-[#1a252f] hover:border-[#1a252f] active:bg-[#1a252f] active:border-[#1a252f] text-white focus:shadow-calendar relative z-0 focus:z-[1] ml-[-1px]", {
        "bg-[#1a252f]": active == 'listMonth'
    })} onClick={() => setView('listMonth')}>list</Button>
  </div>
*/