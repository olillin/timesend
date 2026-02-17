import { NextFunction, Request, Response } from "express"
import { getSessionTokens } from "../session"
import { createClient, generateAuthUrl } from "../google/auth"

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Check if authorized by attempting to get session tokens
        const credentials = getSessionTokens(req)
        if (typeof credentials.expiry_date === 'number') {
            const now = new Date()
            if (credentials.expiry_date <= now.getTime()) {
                throw new Error("Token expired")
            }
        }

        next()
    } catch (err) {
        // Redirect to authorization
        const client = await createClient()
        const authUrl = generateAuthUrl(client, req.url)
        res.redirect(302, authUrl)
    }
}
