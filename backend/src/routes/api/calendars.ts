import type { CalendarsResponse } from "@shared"
import { Request, Response } from "express"
import { listCalendars } from "../../google/calendar"
import { createClientFromSession } from "../../session"

export default async (req: Request, res: Response) => {
    const client = await createClientFromSession(req)

    await listCalendars(client)
        .then(calendars => {
            res.json({ calendars } as CalendarsResponse)
        })
        .catch((reason) => {
            console.error('Failed to get calendars')
            console.error(reason)
            res.status(500)
                .json({
                    error: {
                        message: 'Failed to get calendars',
                        details: reason,
                    }
                })
        })
}