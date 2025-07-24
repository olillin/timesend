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