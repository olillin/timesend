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

const shortEventSeparator = '\x1E'
const shortEventPropertySeparator = '\x1F'

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
        return `${shortName}${shortEventPropertySeparator}${value}`
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
        new Property('UID', crypto.randomUUID()),
        new Property('DTSTAMP', toDateTimeString(new Date())),
    ]

    body.split('\n').forEach(line => {
        const index = line.indexOf(shortEventPropertySeparator)
        const shortName = line.slice(0, index)
        const value = line.slice(index + 1)

        const name = propertyNameMap[shortName]
        if (name === undefined) {
            // Add to previous property
            const lastPropIndex = props.length - 1
            const lastProp: Property = props[lastPropIndex]
            lastProp.setValue(lastProp.getValue() + "\n" + line)
            return
        }
        // Infer date type from format
        const isDate = dateProperties.has(name) && !value.includes('T')
        let params = isDate ? {VALUE: 'DATE'} : undefined

        const prop = new Property(name, value, params)
        props.push(prop)
    })

    const event = new CalendarEvent(new Component('VEVENT', props))
    console.log(event)
    return event
}

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
