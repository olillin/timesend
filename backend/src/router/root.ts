import { Router } from 'express'
import * as routes from '~/routes/index.js'
import api from './api.js'

const root = Router()

root.use('/api', api)
root.get('/callback', routes.callback)

export default root
