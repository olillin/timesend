import { Request, Response } from 'express'
import { recreateAuthenticatedClient } from 'src/google/auth'
import { addEvents } from 'src/google/calendar'
import { deserializeEvents } from 'src/serialize'
import { CustomSession, getSessionTokens } from 'src/session'

export default async (req: Request, res: Response) => {
    res.setHeader('Accept', 'application/json')

    const session = req.session as CustomSession
    const currentEvents: string | undefined = req.body['events'] ?? session.currentEvents

    if (!currentEvents) {
        res.status(400).json({
            error: {
                message: 'No events provided'
            }
        })
        return
    }

    if (!typeof currentEvents) {
        res.status(400).json({
            error: {
                message: 'Events must be provided as serialized string'
            }
        })
        return
    }

    const calendarId: string | undefined = req.body['calendarId']
    if (!calendarId) {
        res.status(400).json({
            error: {
                message: 'calendarId must be provided in body'
            }
        })
        return
    }

    const events = deserializeEvents(currentEvents)

    const auth = await recreateAuthenticatedClient(getSessionTokens(req))

    await addEvents(auth, calendarId, events).then(res => {
        // TODO: Respond to client
    })
}