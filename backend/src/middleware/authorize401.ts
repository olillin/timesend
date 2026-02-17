import { NextFunction, Request, Response } from "express"
import { getSessionTokens } from "../session"

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Check if authorized by attempting to get session tokens
        getSessionTokens(req)

        next()
    } catch (err) {
        res.status(401).json({
            error: {
                message: 'Unauthorized'
            }
        })
    }
}
