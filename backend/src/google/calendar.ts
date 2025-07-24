import type { CalendarEntry } from "@shared"
import { OAuth2Client } from "google-auth-library"
import { calendar_v3, google } from "googleapis"
import { CalendarEvent, parseDate, Property } from "iamcal"

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

export function padZeros(num: number, maxLength: number): string {
    return num.toString().padStart(maxLength, '0')
}

export function toGoogleDate(dateProperty: Property): calendar_v3.Schema$EventDateTime {
    const date = parseDate(dateProperty)
    if (dateProperty.params.includes('VALUE=DATE')) {
        return {
            date: padZeros(date.getFullYear(), 4) + '-'
                + padZeros(date.getMonth() + 1, 2) + '-'
                + padZeros(date.getDate(), 2)
        }
    } else {
        return {
            dateTime: date.toISOString()
        }
    }
}

function toGoogleEvent(event: CalendarEvent): calendar_v3.Schema$Event {
    if (!event.getProperty('DTEND')) {
        throw new Error('Event is missing DTEND which is required')
    }

    return {
        start: toGoogleDate(event.getProperty('DTSTART')!),
        end: toGoogleDate(event.getProperty('DTEND')!),
        summary: event.summary(),
        description: event.description(),
        created: event.created()?.toISOString(),

    }
}

/**
 * Add events to a Google Calendar
 * @param calendarId The Google Calendar id
 * @param auth An authorized OAuth2 client.
 */
export async function addEvents(auth: OAuth2Client, calendarId: string, events: CalendarEvent[]): Promise<void> {
    const calendar = authorizeGoogleCalendar(auth)

    const responses = await Promise.all(events.map(event => {
        const requestBody = toGoogleEvent(event)
        return calendar.events.insert({
            calendarId,
            requestBody,
        })
    }))

    // TODO: Return result
}
