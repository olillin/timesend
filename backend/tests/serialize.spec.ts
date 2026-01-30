import { randomUUID } from "crypto"
import { CalendarEvent } from "iamcal"
import { deserializeEvents, serializeEvents } from '../src/serialize'

const now = new Date(2025, 6, 24, 8)
const tomorrow = new Date(2025, 6, 25, 12)
const exampleEvents1: CalendarEvent[] = [
    new CalendarEvent(randomUUID(), now)
        .setSummary('My example event')
        .setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum a volutpat lacus. Donec volutpat elit vel ullamcorper rhoncus. Praesent tincidunt convallis erat, consectetur consectetur tellus pretium sed. Praesent porta nisl ut felis faucibus consectetur. In eu lectus eget magna pellentesque interdum. Nunc eu iaculis ipsum, a facilisis felis. Morbi in nisl interdum, aliquet massa ut, facilisis magna. Praesent lectus purus, interdum eu hendrerit sed, pharetra id turpis. Integer vulputate ipsum blandit, aliquam est vitae, semper tellus. Quisque tincidunt consectetur ligula. Pellentesque est tellus, rhoncus quis consequat tristique, pretium facilisis libero. In rhoncus sapien vel consequat elementum.  Fusce sagittis volutpat fringilla. Phasellus a lobortis diam. Maecenas euismod eget ante ut eleifend. Nam ultrices non leo fermentum lacinia. Cras accumsan feugiat urna, at scelerisque risus consectetur non. Phasellus euismod enim elit, ac egestas metus consectetur tempor. Nunc varius elit lorem, sit amet sodales erat lacinia ac. Phasellus feugiat finibus condimentum. Sed ut lacus in tellus placerat ullamcorper. Quisque consectetur lectus sed dolor ornare posuere. ')
        .setStart(now, true)
        .setEnd(tomorrow, true),

    new CalendarEvent(randomUUID(), now)
        .setSummary('Cool party for all my friends')
        .setEnd(tomorrow)
        .setLocation('Hubben')
        .setStart(now),

    new CalendarEvent(randomUUID(), now)
        .setSummary('My example event')
        .setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum a volutpat lacus. Donec volutpat elit vel ullamcorper rhoncus. Praesent tincidunt convallis erat, consectetur consectetur tellus pretium sed. Praesent porta nisl ut felis faucibus consectetur. In eu lectus eget magna pellentesque interdum. Nunc eu iaculis ipsum, a facilisis felis. Morbi in nisl interdum, aliquet massa ut, facilisis magna. Praesent lectus purus, interdum eu hendrerit sed, pharetra id turpis. Integer vulputate ipsum blandit, aliquam est vitae, semper tellus. Quisque tincidunt consectetur ligula. Pellentesque est tellus, rhoncus quis consequat tristique, pretium facilisis libero. In rhoncus sapien vel consequat elementum.  Fusce sagittis volutpat fringilla. Phasellus a lobortis diam. Maecenas euismod eget ante ut eleifend. Nam ultrices non leo fermentum lacinia. Cras accumsan feugiat urna, at scelerisque risus consectetur non. Phasellus euismod enim elit, ac egestas metus consectetur tempor. Nunc varius elit lorem, sit amet sodales erat lacinia ac. Phasellus feugiat finibus condimentum. Sed ut lacus in tellus placerat ullamcorper. Quisque consectetur lectus sed dolor ornare posuere. ')
        .setStart(now, true)
        .setEnd(tomorrow, true),
]

const exampleEvents2 = [
    new CalendarEvent(randomUUID(), now)
        .setSummary('Ansvar: Cal, Göken')
        .setStart(now, true)
        .setEnd(tomorrow, true),
    new CalendarEvent(randomUUID(), now)
        .setSummary('Ansvar: Ymer, Blues')
        .setStart(now, true)
        .setEnd(tomorrow, true),
    new CalendarEvent(randomUUID(), now)
        .setSummary('Ansvar: Bob, Swish')
        .setStart(now, true)
        .setEnd(tomorrow, true),
    new CalendarEvent(randomUUID(), now)
        .setSummary('Ansvar: Borgen, Dino')
        .setStart(now, true)
        .setEnd(tomorrow, true), new CalendarEvent(randomUUID(), now)
            .setSummary('Ansvar: Cal, Göken')
            .setStart(now, true)
            .setEnd(tomorrow, true),
    new CalendarEvent(randomUUID(), now)
        .setSummary('Ansvar: Ymer, Blues')
        .setStart(now, true)
        .setEnd(tomorrow, true),
    new CalendarEvent(randomUUID(), now)
        .setSummary('Ansvar: Bob, Swish')
        .setStart(now, true)
        .setEnd(tomorrow, true),
    new CalendarEvent(randomUUID(), now)
        .setSummary('Ansvar: Borgen, Dino')
        .setStart(now, true)
        .setEnd(tomorrow, true), new CalendarEvent(randomUUID(), now)
            .setSummary('Ansvar: Cal, Göken')
            .setStart(now, true)
            .setEnd(tomorrow, true),
    new CalendarEvent(randomUUID(), now)
        .setSummary('Ansvar: Ymer, Blues')
        .setStart(now, true)
        .setEnd(tomorrow, true),
    new CalendarEvent(randomUUID(), now)
        .setSummary('Ansvar: Bob, Swish')
        .setStart(now, true)
        .setEnd(tomorrow, true),
    new CalendarEvent(randomUUID(), now)
        .setSummary('Ansvar: Borgen, Dino')
        .setStart(now, true)
        .setEnd(tomorrow, true),
]

describe('serialize and deserialize', () => {
    /** Remove all ignored properties from calendar body. */
    function ignoreProperties(calendarBody: string): string {
        return calendarBody.replace(/^(UID|DTSTAMP):.+?$/gm, '')
    }

    function testEvents(events: CalendarEvent[]) {
        const serialized = serializeEvents(events)
        const deserialized = deserializeEvents(serialized)

        const originalBody = events.map(e => e.serialize()).join('\n')
        const deserializedBody = deserialized.map(e => e.serialize()).join('\n')

        expect(ignoreProperties(deserializedBody)).toStrictEqual(ignoreProperties(originalBody))
    }

    it('deserializes to the same value with example 1', () => testEvents(exampleEvents1))
    it('deserializes to the same value with example 2', () => testEvents(exampleEvents2))

})
