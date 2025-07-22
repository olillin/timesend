import { Router } from "express"
import * as routes from "../routes"

const api = Router()
export default api

api.get('/calendars', routes.calendars)
