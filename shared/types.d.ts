import { calendar_v3 } from "googleapis"

export interface CalendarEntry {
    id: string
    summary: string
    backgroundColor: string
    foregroundColor: string
}

export interface CalendarsResponse {
    calendars: CalendarEntry[]
}

export interface UploadResponse {
    url: string
}

export interface AddedEvent {
    /** If the event was added successfully  */
    success: boolean

    start: calendar_v3.Schema$EventDateTime
    end: calendar_v3.Schema$EventDateTime
    summary?: string
    description?: string
    location?: string
}

export interface AddEventsResponse {
    events: AddedEvent[]
}