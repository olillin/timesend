import { Router } from 'express'
import * as middleware from '~/middleware/index.js'
import * as apiRoutes from '~/routes/api/index.js'

const api = Router()
export default api

api.get('/calendars', middleware.authorize401, apiRoutes.calendars)
api.post('/upload', apiRoutes.upload)
api.post('/events', middleware.authorize401, apiRoutes.addEvents)
