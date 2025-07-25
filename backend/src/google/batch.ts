import { OAuth2Client } from 'google-auth-library'
import { GaxiosPromise } from 'gaxios'
import googleBatch from 'google-batch'
import { authorizeGoogleCalendar } from './calendar'

export interface GoogleBatch {
    setAuth: (auth: OAuth2Client) => this
    clear: () => this
    add: (calls: GaxiosPromise<any> | GaxiosPromise<any>[]) => this
    exec: <T>(callback: (error: Error | null, responses: any | null, errors: null | string[]) => T) => T
}

export interface BatchWithCalendar {
    batch: GoogleBatch
    calendar: ReturnType<typeof authorizeGoogleCalendar>
}

export function authorizeBatch(auth: OAuth2Client): GoogleBatch {
    const batch = new googleBatch()
    batch.setAuth(auth)
    return batch
}

export function authorizeBatchWithCalendar(auth: OAuth2Client): BatchWithCalendar {
    const batch = authorizeBatch(auth)
    const google = googleBatch.require('googleapis')
    const calendar = authorizeGoogleCalendar(auth, google)
    return { batch, calendar }
}
