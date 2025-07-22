import fs from 'fs/promises'
import { Credentials, OAuth2Client, OAuth2ClientOptions } from 'google-auth-library'
import path from 'path'
import process from 'process'

const SCOPES = [
    'https://www.googleapis.com/auth/calendar.events.owned',
    'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
]
const CREDENTIALS_PATH = path.join(process.cwd(), '../credentials.json')

/**
 * Represents the downloaded credentials when creating a new OAuth2 client in
 * Google Cloud with the type Web Application.
 */
export interface DownloadedWebCredentials {
    web: {
        client_id: string
        project_id: string
        auth_uri: string
        token_uri: string
        auth_povider_x509_cert_url: string
        client_secret: string
        redirect_uris: string[]
    }
}

/**
 * Reads OAuth2 client credentials from the credentials file
 */
async function loadCredentials(): Promise<OAuth2ClientOptions | null> {
    try {
        const content = await fs.readFile(CREDENTIALS_PATH)
        const keys = JSON.parse(content.toString()) as DownloadedWebCredentials
        const credentials: OAuth2ClientOptions = {
            clientId: keys.web.client_id,
            clientSecret: keys.web.client_secret,
            redirectUri: keys.web.redirect_uris[0],
        }
        return credentials
    } catch (err) {
        return null
    }
}

export async function createClient(): Promise<OAuth2Client> {
    let clientCredentials = await loadCredentials()
    if (!clientCredentials) {
        throw Error(`Unable to authorize, ${CREDENTIALS_PATH} does not exist. Download it from Google Cloud Platform`)
    }

    return new OAuth2Client(clientCredentials)
}

/**
 * Create a OAuth2 client which has been authorized with the OAuth2 flow.
 * @param credentials the tokens previously created by the client.
 */
export async function recreateAuthenticatedClient(credentials: Credentials): Promise<OAuth2Client> {
    const client = await createClient()
    client.setCredentials(credentials)
    return client
}

export function generateAuthUrl(client: OAuth2Client, state?: string) {
    const authorizeUrl = client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        state,
    })
    return authorizeUrl
}

export async function createAuthUrl() {
    return generateAuthUrl(await createClient())
}
