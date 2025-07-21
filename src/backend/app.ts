import cookieSession from 'cookie-session'
import express from 'express'
import fs from 'fs'
import http from 'http'
import https from 'https'
import { ENVIRONMENT } from './environment'
import api from './router/api'

// Paths
const PUBLIC_DIRECTORY = 'public'

// Setup express app
const app = express()

const ONE_DAY = 24 * 60 * 60 * 1000
app.use(cookieSession({
    keys: [ENVIRONMENT.SECRET],
    maxAge: ONE_DAY,
}))

if (fs.existsSync(PUBLIC_DIRECTORY)) {
    app.use('/', express.static(PUBLIC_DIRECTORY))
} else {
    console.warn('WARNING: No public directory')
}

// Add API router
app.use('/', api)

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