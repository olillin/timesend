import { expect, test } from 'vitest'
import { CalendarEvent, CalendarDateTime } from 'iamcal'
import { deserializeEvents, serializeEvents } from '~/serialize'

const start = new CalendarDateTime('20260319T120000')
const end = new CalendarDateTime('20260319T180000')

const events = [
    new CalendarEvent('event1', start, start)
        .setEnd(end)
        .setSummary('My example event')
        .setDescription(
            'Lorem ipsum dolor sit amet, consectetur adipiscing' +
                ' elit. Vestibulum a volutpat lacus. Donec volutpat' +
                ' elit vel ullamcorper rhoncus. Praesent tincidunt'
        ),
    new CalendarEvent('event2', start, start)
        .setEnd(end)
        .setSummary('Foobar')
        .setLocation('Spam'),
]

test('serializing and deserializing returns the same events', () => {
    /** Remove all ignored properties from calendar body. */
    function ignoreProperties(calendarBody: string): string {
        return calendarBody.replace(/^(UID|DTSTAMP):.+?$/gm, '')
    }

    const serialized = serializeEvents(events)
    const deserialized = deserializeEvents(serialized)

    const originalBody = events.map(event => event.serialize()).join('\n')
    const deserializedBody = deserialized
        .map(event => event.serialize())
        .join('\n')

    expect(ignoreProperties(deserializedBody)).toStrictEqual(
        ignoreProperties(originalBody)
    )
})
