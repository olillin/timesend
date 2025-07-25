
const title = document.getElementById('title') as HTMLHeadingElement
const output = document.getElementById('p') as HTMLParagraphElement

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
        output.innerText = 'Adding failed'
        return
    }
    title.innerText = 'Added events to calendar'
    const eventCount = 0
    const calendarName = 'N/A'
    output.innerText = `Successfully added ${eventCount} events to ${calendarName}\n${response}`
})