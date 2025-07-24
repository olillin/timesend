import { NextFunction, Request, Response } from 'express'
import { CustomSession } from 'src/session'

export default async (req: Request, res: Response, next: NextFunction) => {
    if (!req.query['events']?.toString().trim()) {
        next()
        return
    }

    const currentEvents = req.query['events'].toString()
    const session = req.session as CustomSession
    session.currentEvents = currentEvents

    // Remove 'events' from URL
    const searchString = req.url.slice(req.url.indexOf('?'))
    const search = new URLSearchParams(searchString)
    search.delete('events')
    const url = req.url.replace(/\?.*/, search.size ? `?${search}` : '')
    console.log(`New url: ${url}`)

    res.redirect(url)
}