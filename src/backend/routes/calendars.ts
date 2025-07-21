import { Request, Response } from "express"
import { createClientFromSession } from "../session"
import { listCalendars } from "../google/calendar"

export default async (req: Request, res: Response) => {
    const client = await createClientFromSession(req)

    const calendars = await listCalendars(client)
        .catch((err) => {
            res.status(500)
                .end(`Failed to get calendars: ${err}`)
            return null
        })

    if (!calendars) return

    const body = calendars.map(calendar => `(${calendar.color}) ${calendar.summary}`).join('\n')
    res.end(body)
}