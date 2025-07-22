import { Router } from "express"
import * as middleware from "../middleware"
import * as routes from "../routes"
import api from "./api"

const root = Router()
export default root

root.use('/api', middleware.authorize401, api)

root.get('/callback', routes.callback)
