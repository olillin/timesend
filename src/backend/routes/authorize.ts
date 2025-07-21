import { Request, Response } from "express"
import { createAuthUrl } from "../googleCalendar"

export default async (req: Request, res: Response) => {
    const authUrl = await createAuthUrl()
    res.redirect(authUrl)
}