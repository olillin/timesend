import { NextFunction, Request, Response } from "express"
import { getSessionTokens } from "../session"
import { createClient, generateAuthUrl, recreateAuthenticatedClient } from "../google/auth"

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Check if authorized by attempting to get session tokens
        const credentials = getSessionTokens(req)
        console.log(credentials)
        if (typeof credentials.expiry_date === 'number') {
            const now = new Date()
            if (credentials.expiry_date <= now.getTime()) {
                throw new Error("Token expired")
            }
        }

        next()
    } catch (err) {
        console.log(`User is unauthorized (${(err as Error).message})`)
        // Redirect to authorization
        const client = await createClient()
        const authUrl = generateAuthUrl(client, req.url)
        res.redirect(302, authUrl)
    }
}
