import { CalendarEvent, Component, Property, toDateTimeString } from "iamcal"
import pako from 'pako'

const propertyShortNameMap: { [_: string]: string } = {
    'DTSTART': 's',
    'DTEND': 'e',
    'SUMMARY': 'm',
    'DESCRIPTION': 'd',
    'LOCATION': 'l',
} as const

const propertyNameMap = Object.fromEntries(
    Object.entries(propertyShortNameMap).map(([a, b]) => [b, a])
)

const dateProperties = new Set<string>([
    'DTSTAMP',
    'DTSTART',
    'DTEND',
])

/**
 * Convert an event to a shorter representation than normal by taking some liberties.
 * 
 * Namely: 
 * - Only the properties in {@link propertyShortNameMap} are preserved.
 * - BEGIN and END lines of the VEVENT block are omitted
 *
 * @see {@link expandEvent}
 */
function shortenEvent(event: CalendarEvent): string {
    const lines = event.properties.map(prop => {
        const shortName: string | undefined = propertyShortNameMap[prop.name]
        if (!shortName) return null

        let value = prop.value
        return `${shortName}:${value}`
    }).filter(prop => prop !== null)

    const body = lines.join('\n')
    return body
}

/**
 * Return the short event to normal
 * @see {@link shortenEvent}
 */
function expandEvent(body: string): CalendarEvent {
    const props: Property[] = [
        {
            name: 'UID',
            params: [],
            value: crypto.randomUUID(),
        },
        {
            name: 'DTSTAMP',
            params: [],
            value: toDateTimeString(new Date()),
        }
    ]

    body.split('\n').forEach(line => {
        const index = line.indexOf(':')
        const shortName = line.slice(0, index)
        const value = line.slice(index + 1)

        const name = propertyNameMap[shortName]

        const params: string[] = []
        // Infer if a date is of type DATE and not the default DATETIME
        if (dateProperties.has(name)) {
            if (!value.includes('T')) {
                params.push('VALUE=DATE')
            }
        }

        const prop: Property = {
            name,
            params,
            value,
        }

        props.push(prop)
    })

    return new CalendarEvent(new Component('VEVENT', props))
}

const shortEventSeparator = '\x1E'

/**
 * Serialize a list of calendar events into a URL-safe string
 * @see {@link deserializeEvents}
 */
export function serializeEvents(events: CalendarEvent[]): string {
    const shortBody = events.map(shortenEvent).join(shortEventSeparator)
    const compressed = pako.deflate(shortBody)
    const encoded = Buffer.from(compressed).toString('base64url')
    return encoded
}

/**
 * Deserialize a serialized string into a list of calendar events
 * @param serialized the serialized events produced from {@link serializeEvents}
 * @see {@link serializeEvents}
 */
export function deserializeEvents(serialized: string): CalendarEvent[] {
    const encoded = serialized
    const compressed = Buffer.from(encoded, 'base64url')
    const shortBody = Buffer.from(pako.inflate(compressed)).toString('utf8')
    const events = shortBody.split(shortEventSeparator).map(expandEvent)
    return events
}
