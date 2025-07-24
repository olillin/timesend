import { Router } from "express"
import * as routes from "../routes"
import api from "./api"

const root = Router()
export default root

root.use('/api', api)

root.get('/callback', routes.callback)
