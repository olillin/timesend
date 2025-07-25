import type { AddEventsResponse } from "@shared"

const title = document.getElementById('title') as HTMLHeadingElement
const output = document.getElementById('output') as HTMLParagraphElement

const url = new URL(document.location.href)
const calendarId = url.searchParams.get('calendar')

fetch('/api/events', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        calendarId
    }),
}).then(response => {
    if (!response.ok) {
        title.innerText = 'Failed to add events to calendar'
        output.innerText = 'Adding failed completely'
        throw 1
    }
    return response.json()
        .then(json => json as AddEventsResponse)
}).then(response => {
    const events = response.events
    const successfulEvents = events.filter(event => event.success)
    const failedEvents = events.filter(event => !event.success)

    title.innerText = 'Added events to calendar'
    const calendarName = 'N/A'
    output.innerText = `Successfully added ${eventCount} events to ${calendarName}\n${JSON.stringify(response)}`

}).catch()