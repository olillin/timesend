import { NextFunction, Request, Response } from "express"
import { CustomSession, getSessionTokens } from "../session"
import { createClient, generateAuthUrl } from "../google/auth"

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Check if authorized by attempting to get session tokens
        getSessionTokens(req)

        next()
    } catch (err) {
        console.log(`User is unauthorized (${(err as Error).message})`)
        // Redirect to authorization
        const client = await createClient()
        const authUrl = generateAuthUrl(client, req.url)
        res.redirect(302, authUrl)
    }
}
