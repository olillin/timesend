import { Request, Response } from "express"
import { createClient } from "../google/auth"
import { setSessionTokens } from "../session"

export default async (req: Request, res: Response) => {
    const qs = new URL(req.url, 'http://localhost:3000')
        .searchParams
    if (!qs.has('code')) {
        res.status(401).end('No code provided')
    }
    const code = qs.get('code')!

    const client = await createClient()
    const tokens = await client.getToken(code)
        .then(tokenRes => tokenRes.tokens)
        .catch(() => null)

    if (!tokens) {
        res.status(401).end('Failed to authenticate, the code may be invalid or expired.')
        return
    }

    setSessionTokens(req, tokens)

    let redirectTo = '/p/selectCalendar'
    if (!qs.has('state')) {
        redirectTo = qs.get('state')!
    }
    res.redirect(redirectTo)
}
