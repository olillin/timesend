const calendarList = document.getElementById('calendarList') as HTMLDivElement

fetch('/api/calendars')
    .then(res => new Promise<import('@shared').CalendarsResponse>((resolve, reject) => {
        if (res) {
            resolve(res.json())
        } else {
            reject()
        }
    }))
    .then(calendars => updateCalendarList(calendars))
    .catch(reason => {
        const error = document.createElement('p')
        error.innerText = 'Failed to get calendars, try again later'
        error.className = 'error'

        calendarList.appendChild(error)
    })

function updateCalendarList(response: import('@shared').CalendarsResponse) {
    const calendars = response.calendars

    calendars.forEach(calendar => {
        const item = document.createElement('div')
        item.className = 'calendarButton'
        item.setAttribute('data-calendarid', calendar.id)
        item.style.setProperty('--calendarBackground', calendar.backgroundColor)
        item.style.setProperty('--calendarForeground', calendar.foregroundColor)

        const card = document.createElement('div')
        card.className = 'calendarCard'

        const coloredDot = document.createElement('div')
        coloredDot.className = 'coloredDot'

        const summary = document.createElement('span')
        summary.innerText = calendar.summary
        summary.className = 'summary'

        card.appendChild(coloredDot)
        card.appendChild(summary)
        item.appendChild(card)
        calendarList.appendChild(item)

        // Add event
        item.addEventListener('click', selectCalendar)
    })
}

function selectCalendar(event: MouseEvent) {
    const element = event.currentTarget as HTMLElement
    const id = element.getAttribute('data-calendarid')
    if (!id) {
        console.error(`Unable to get 'data-calendarid' on ${element}`)
        return
    }

    const url = createRedirectUrl(id)
    location.href = url
}

function createRedirectUrl(calendarId: string): string {
    const currentUrl = new URL(document.location.href)
    const searchParams: string = currentUrl.searchParams.toString()

    return `/p/addEvents?calendar=${calendarId}&` + searchParams
}