import cors from 'cors'
import { Router, Request, Response } from 'express'
import bodyParser from 'body-parser'

const homeRouter = Router()
export function getHomeRouter(storeCorsOptions): Router {
  homeRouter.use(cors(storeCorsOptions), bodyParser.json())

  homeRouter.get('/', async (req: Request, res: Response) => {
    res.sendStatus(200)
  })

  homeRouter.post('/', async (req: Request, res: Response) => {
    res.sendStatus(200)
  })

  return homeRouter
}
