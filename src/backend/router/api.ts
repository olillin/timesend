import { Router } from "express"
import authorize from "../routes/authorize"
import callback from "../routes/callback"

const api = Router()
export default api

api.get('/authorize', authorize)
api.get('/callback', callback)
