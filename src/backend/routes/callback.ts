import { Request, Response } from "express"
import { createAuthenticatedClient, listEvents } from "../googleCalendar"

export default async (req: Request, res: Response) => {
    const qs = new URL(req.url, 'http://localhost:3000')
        .searchParams
    if (!qs.has('code')) {
        res.status(401).end('No code provided')
    }
    const code = qs.get('code')!

    const oAuth2Client = await createAuthenticatedClient(code)
        .catch(error => {
            return null
        })

    if (!oAuth2Client) {
        res.status(401).end('Failed to authenticate, the code may be invalid or expired.')
        return
    }

    res.end('Authentication successful! Please return to the console.')

    console.info('Client authenticated.')

    console.log('Upcoming events:')
    console.log(await listEvents(oAuth2Client))
}