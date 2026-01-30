const title = document.getElementById('title') as HTMLHeadingElement
const output = document.getElementById('output') as HTMLParagraphElement
const successfulEventsDiv = document.getElementById('successfulEvents') as HTMLDivElement
const successfulEventsList = document.getElementById('successfulEventsList') as HTMLUListElement
const failedEventsDiv = document.getElementById('failedEvents') as HTMLDivElement
const failedEventsList = document.getElementById('failedEventsList') as HTMLUListElement

const url = new URL(document.location.href)
const calendarId = url.searchParams.get('calendar')

function isErrorResponse(response: any): response is import('@shared').ErrorResponse {
    return !!response['error']
}

fetch('/api/events', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        calendarId
    }),
}).then<import('@shared').ErrorResponse | import('@shared').AddEventsResponse>(response => {
    if (!response.ok) {
        title.innerText = 'Failed to add events to calendar'
        output.innerText = 'Adding failed completely'
        output.classList.add('error')
        if (response.headers.get('Content-Type')?.includes('application/json')) {
            return response.json() as Promise<import('@shared').ErrorResponse>
        } else {
            throw 'Adding failed completely'
        }
    }
    return response.json() as Promise<import('@shared').AddEventsResponse>
}).then(response => {
    if (isErrorResponse(response)) {
        output.innerHTML += '<br>'
        output.innerText += `Details: ${response.error.message}`
        throw 'Adding failed completely, added details'
    }

    const events = response.events

    const successfulEvents = events.filter(event => event.success)
    const failedEvents = events.filter(event => !event.success)

    title.innerText = 'Added events to calendar'
    output.innerText = `Successfully added ${successfulEvents.length} events to calendar`

    successfulEventsDiv.style.display = ''
    successfulEvents.forEach(addedEvent => {
        const element = createAddedEventElement(addedEvent)
        successfulEventsList.appendChild(element)
    })

    if (failedEvents.length > 0) {
        failedEventsDiv.style.display = ''
        output.innerHTML += `<br><span class="error">Failed to add ${failedEvents.length} events, see below</span>`

        failedEvents.forEach(addedEvent => {
            const element = createAddedEventElement(addedEvent)
            failedEventsList.appendChild(element)
        })
    }
}).catch(error => {
    console.warn(error)
})

function createAddedEventElement(addedEvent: import('@shared').AddedEvent): HTMLElement {
    const container = document.createElement('details')
    container.classList.add('addedEvent')

    const summary = document.createElement('summary')
    const summaryBody = document.createElement('div')
    const summaryText = document.createElement('h4')
    summaryText.classList.add('summary')
    if (addedEvent.summary) {
        summaryText.innerText = addedEvent.summary
    } else {
        summaryText.innerText = 'No summary'
        summaryText.classList.add('noValue')
    }
    summaryBody.appendChild(summaryText)

    let timeElement: HTMLElement
    try {
        timeElement = createEventTimesElement(addedEvent.start, addedEvent.end)
    } catch {
        timeElement = document.createElement('span')
        timeElement.classList.add('eventTimes', 'error')
        timeElement.innerText = 'Invalid time'
    }
    summaryBody.appendChild(timeElement)

    summary.appendChild(summaryBody)
    container.appendChild(summary)

    const detailsBody = document.createElement('div')
    detailsBody.classList.add('eventDetails')

    if (addedEvent.location) {
        const location = document.createElement('span')
        location.classList.add('location')
        location.innerText = addedEvent.location

        detailsBody.appendChild(location)
    }

    if (addedEvent.description) {
        const description = document.createElement('p')
        description.classList.add('description')
        description.innerText = addedEvent.description

        detailsBody.appendChild(description)
    }

    if (detailsBody.children.length !== 0) {
        container.appendChild(detailsBody)
        container.classList.add('hasDetails')
    }

    return container
}

function createEventTimesElement(start: import('@shared').AddedEvent['start'], end: import('@shared').AddedEvent['end']): HTMLElement {
    // Parse times
    const startTimeString = start.dateTime ?? start.date ?? null
    if (startTimeString === null) throw new Error('Start has no value')

    const endTimeString = end.dateTime ?? end.date ?? null
    if (endTimeString === null) throw new Error('End has no value')

    const startTime = new Date(startTimeString)
    let endTime = new Date(endTimeString)
    const hasTime = !!start.dateTime
    if (!hasTime) {
        const ONE_DAY_MS = 24 * 60 * 60 * 1000
        endTime = new Date(endTime.getTime() - ONE_DAY_MS)
    }
    const now = new Date()
    const includeYear = startTime.getFullYear() !== now.getFullYear() || endTime.getFullYear() !== now.getFullYear()

    const prettyStartTime = formatTime(startTime, includeYear, hasTime)
    const prettyEndTime = formatTime(endTime, includeYear, hasTime)

    // Create elements
    const container = document.createElement('span')
    container.classList.add('eventTimes')

    const startElement = document.createElement('time')
    startElement.dateTime = startTimeString
    startElement.innerText = prettyStartTime
    startElement.classList.add('start')
    container.appendChild(startElement)

    const endElement = document.createElement('time')
    endElement.dateTime = endTimeString
    endElement.innerText = prettyEndTime
    endElement.classList.add('end')
    container.appendChild(endElement)

    return container
}

function formatTime(time: Date, includeYear: boolean, includeTime: boolean): string {
    const dateString = `${time.getDate()}/${time.getMonth() + 1}`
    const yearString = includeYear ? ` ${time.getFullYear()}` : ''
    const timeString = includeTime ? ` ${time.getHours()}:${time.getMinutes()}` : ''
    return dateString + yearString + timeString
}
