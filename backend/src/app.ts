import cookieSession from 'cookie-session'
import express from 'express'
import fs from 'fs'
import http from 'http'
import https from 'https'
import path from 'path'
import { ENVIRONMENT } from './environment'
import * as middleware from './middleware'
import rootRouter from './router/root'

// Paths
const PUBLIC_DIRECTORY = 'public'

// Setup express app
const app = express()

const ONE_DAY = 24 * 60 * 60 * 1000
app.use(cookieSession({
    keys: [ENVIRONMENT.SECRET],
    maxAge: ONE_DAY,
}))

app.use(middleware.debug)

app.use('/', rootRouter)

if (fs.existsSync(PUBLIC_DIRECTORY)) {
    app.use('/privileged', (req, res) => {
        res.status(404).end()
    })
    app.use('/', express.static(PUBLIC_DIRECTORY))
    app.use('/p', middleware.authorizeRedirect, express.static(path.join(PUBLIC_DIRECTORY, 'privileged')))
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