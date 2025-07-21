import { Router } from "express"
import * as routes from "../routes"
import * as middleware from "../middleware"

const api = Router()
export default api

api.get('/callback', routes.callback)
api.get('/calendars', middleware.authorize, routes.calendars)
