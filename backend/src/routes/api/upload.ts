import { UploadResponse } from "@shared"
import { Request, Response } from "express"
import { Calendar, parseCalendar } from "iamcal"
import { serializeEvents } from "../../serialize"
import { CALENDAR_MIME_TYPE } from "../../app"

export default async (req: Request, res: Response) => {
    res.setHeader('Accept', CALENDAR_MIME_TYPE)

    if (req.headers["content-type"] !== CALENDAR_MIME_TYPE) {
        res.status(400).json({
            error: {
                message: "Content-Type must be 'text/calendar'"
            }
        })
        return
    }

    const requestBody = req.body as string
    let calendar: Calendar
    try {
        calendar = await parseCalendar(requestBody).catch(() => { throw 1 })
    } catch {
        res.status(400).json({
            error: {
                message: 'Calendar is invalid'
            }
        })
        return
    }

    const events = calendar.events()
    let serialized: string
    try {
        serialized = serializeEvents(events)
    } catch (e) {
        const message = 'An unexpected error occured while serializing events'
        console.error(message)
        console.error(e)

        res.status(500).json({ error: { message } })
        return
    }

    const url = `${req.protocol}://${req.headers.host ?? req.hostname}/p/selectCalendar?events=${serialized}`
    const responseBody: UploadResponse = { url }
    res.setHeader('Location', url).json(responseBody)

    console.log(`Successfully created new url: ${url}`)
}