import { cn } from "@/lib/utils"
import { google, calendar_v3 } from 'googleapis';
import MyCalendar from "./MyCalendar";

export default async function EventsCalendar(){    
    // Create a calendar instance
    const calendar = google.calendar({ version: 'v3', auth: 'AIzaSyCVtAsJB3U1z0JpSAyDgS777QjUDzTCb4Y' });
    
    // Fetch calendar events
    const events = await calendar.events.list({
        calendarId: 'c_d15402dc8e169148b94c41e45e2c62a5d9a54f6b8cd3bd15ca07337bf0025570@group.calendar.google.com', // Change to your calendar ID
        timeMin: '2023-01-01T00:00:00Z', // Set the start date
        timeMax: '2023-12-31T23:59:59Z', // Set the end date
    });

    const googleCalendarEvents = events.data.items

    interface GoogleCalendarEvent {
        title: string;
        start: string;
        end?: string;
        description?: string;
      }

    const transformedEvents: GoogleCalendarEvent[] = googleCalendarEvents!.map((googleEvent) => {
        // Map the Google Calendar event data to FullCalendar format
        return {
        title: googleEvent.summary as string, // Use 'summary' as the title
        start: googleEvent.start?.dateTime || googleEvent.start?.date as string, // Use 'dateTime' or 'date' as the start time
        end: googleEvent.end?.dateTime || googleEvent.end?.date as string, // Use 'dateTime' or 'date' as the end time
        description: googleEvent.description as string
        };
    });
    
    // 'transformedEvents' now contains the events in the format that FullCalendar expects
  

    return (
        <MyCalendar googleCalendarEvents={transformedEvents} />
      );
}
