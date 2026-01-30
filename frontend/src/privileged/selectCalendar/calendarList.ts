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
        console.error(`Failed to get calendars: ${reason}`)

        const error = document.createElement('p')
        error.innerText = 'Failed to get calendars, try again later'
        error.className = 'error'

        calendarList.appendChild(error)
    })

function updateCalendarList(response: import('@shared').CalendarsResponse) {
    const calendars = response.calendars

    calendars.forEach(calendar => {
        const item = document.createElement('a')
        const url = createRedirectUrl(calendar.id)
        item.href = url

        item.className = 'calendarButton'
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
    })
}

function createRedirectUrl(calendarId: string): string {
    const currentUrl = new URL(document.location.href)
    const searchParams: string = currentUrl.searchParams.toString()

    return `/p/addEvents?calendar=${calendarId}&` + searchParams
}
