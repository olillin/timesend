import type { CalendarEntry } from "@shared"
import { OAuth2Client } from "google-auth-library"
import { calendar_v3, google } from "googleapis"

export function authorizeGoogleCalendar(auth: OAuth2Client): calendar_v3.Calendar {
    //@ts-ignore
    return google.calendar({ version: 'v3', auth })
}

export interface APICalendar {
    id: string
    summary: string
    colorId: string
    backgroundColor: string
    foregroundColor: string
    hidden: boolean
    primary: boolean
}

export type AccessRole = 'owner' | 'writer' | 'reader' | 'freeBusyReader'

/**
 * 
 * @param auth An authorized OAuth2 client.
 */
export async function listCalendars(auth: OAuth2Client): Promise<CalendarEntry[]> {
    const calendarApi = authorizeGoogleCalendar(auth)
    const res = await calendarApi.calendarList.list()
    const calendars: CalendarEntry[] = res.data.items!.filter(calendar => {
        const accessRole = calendar.accessRole as AccessRole | undefined
        return accessRole === 'owner' || accessRole === 'writer'
    }).map(calendar => ({
        id: calendar.id!,
        summary: calendar.summary!,
        backgroundColor: calendar.backgroundColor!,
        foregroundColor: calendar.foregroundColor!,
    }))
    return calendars
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param auth An authorized OAuth2 client.
 */
export async function listEvents(auth: OAuth2Client): Promise<string> {
    const calendar = authorizeGoogleCalendar(auth)
    const res = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    })
    const events = res.data.items
    if (!events || events.length === 0) {
        return 'No upcoming events found.'
    }

    return events.map(event => {
        const start = event.start!.dateTime ?? event.start!.date!
        return `${start} - ${event.summary}`
    }).join('\n')
}
