import cookieSession from 'cookie-session'
import express from 'express'
import fs from 'fs'
import http from 'http'
import https from 'https'
import path from 'path'
import { ENVIRONMENT, CALENDAR_MIME_TYPE } from '~/environment.js'
import * as middleware from '~/middleware/index.js'
import rootRouter from '~/router/root.js'
import bodyParser from 'body-parser'

// Paths
const PUBLIC_DIRECTORY = path.join(import.meta.dirname, 'public')

// Setup express app
const app = express()

const ONE_DAY = 24 * 60 * 60 * 1000
app.use(
    cookieSession({
        keys: [ENVIRONMENT.SECRET],
        maxAge: ONE_DAY,
    })
)

app.use(bodyParser.json())
app.use(bodyParser.text({ type: CALENDAR_MIME_TYPE }))

app.use('/', rootRouter)

if (fs.existsSync(PUBLIC_DIRECTORY)) {
    app.use('/privileged', (req, res) => {
        res.status(404).end()
    })
    app.use('/', middleware.saveEvents, express.static(PUBLIC_DIRECTORY))
    app.use(
        '/p',
        middleware.saveEvents,
        middleware.authorizeRedirect,
        express.static(path.join(PUBLIC_DIRECTORY, 'privileged'))
    )
} else {
    console.warn('WARNING: No public directory')
}

// Start server
var server
var useHttps = fs.existsSync('./key.pem') && fs.existsSync('./cert.pem')
if (useHttps) {
    server = https.createServer(
        {
            key: fs.readFileSync('./key.pem'),
            cert: fs.readFileSync('./cert.pem'),
        },
        app
    )
} else {
    server = http.createServer({}, app)
}

const { PORT } = ENVIRONMENT
server.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})
