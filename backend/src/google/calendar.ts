import type { AddedEvent, CalendarEntry } from "@shared"
import { OAuth2Client } from "google-auth-library"
import { calendar_v3, google, GoogleApis } from "googleapis"
import { CalendarDateOrTime, CalendarEvent } from "iamcal"

export function authorizeGoogleCalendar(auth: OAuth2Client, googleApis?: GoogleApis): calendar_v3.Calendar {
    const useGoogle = googleApis ?? google
    //@ts-ignore
    return useGoogle.calendar({ version: 'v3', auth })
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

export function toGoogleDate(date: CalendarDateOrTime): calendar_v3.Schema$EventDateTime {
    if (!date.isFullDay()) {
        return {
            dateTime: date.getDate().toISOString()
        }
    }

    return {
        date: padZeros(date.getDate().getFullYear(), 4) + '-'
            + padZeros(date.getDate().getMonth() + 1, 2) + '-'
            + padZeros(date.getDate().getDate(), 2)
    }
}

function toGoogleEvent(event: CalendarEvent): calendar_v3.Schema$Event {
    return {
        start: toGoogleDate(event.getStart()),
        end: toGoogleDate(event.getEnd()),
        summary: event.getSummary(),
        description: event.getDescription(),
        location: event.getLocation(),
    }
}

/**
 * Add events to a Google Calendar
 * @param calendarId The Google Calendar id
 * @param auth An authorized OAuth2 client.
 */
export async function addEvents(auth: OAuth2Client, calendarId: string, events: CalendarEvent[]): Promise<AddedEvent[]> {
    return new Promise((resolve, reject) => {
        const calendar = authorizeGoogleCalendar(auth)

        Promise.all(events.map(event => {
            const requestBody = toGoogleEvent(event)
            return calendar.events.insert({ calendarId, requestBody })
        })).then(responses => {
            const events = responses.map((response): AddedEvent => {
                const success = response.status === 200
                const eventData = response.data
                return {
                    success,
                    start: eventData.start!,
                    end: eventData.end!,
                    summary: eventData.summary ?? undefined,
                    description: eventData.description ?? undefined,
                    location: eventData.location ?? undefined,
                }
            })
            resolve(events)
        }).catch(reason => {
            reject(reason)
        })
    })
}
