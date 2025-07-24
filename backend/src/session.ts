import { Request } from 'express'
import { Credentials, OAuth2Client } from 'google-auth-library'
import { recreateAuthenticatedClient } from './google/auth'

export interface CustomSession {
    tokens: Credentials,
    currentEvents: string,
}

export function setSessionTokens(req: Request, tokens: Credentials): void {
    const session = req.session!
    session.tokens = tokens
}

export function getSessionTokens(req: Request): Credentials {
    const session = req.session as CustomSession
    if (!session.tokens) {
        throw new Error('No tokens have been saved')
    }
    return session.tokens
}

export async function createClientFromSession(req: Request): Promise<OAuth2Client> {
    return recreateAuthenticatedClient(await getSessionTokens(req))
}
