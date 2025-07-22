import { NextFunction, Request, Response } from "express"

export default async (req: Request, res: Response, next: NextFunction) => {
    console.log('\n=DEBUG MIDDLEWARE=')

    console.log(`URL: ${req.url}`)
    console.log('Session:')
    console.log(req.session)

    console.log('==================\n')
    next()
}
