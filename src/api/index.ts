import { Router } from "express"

export default () => {
  const router = Router()

  router.get("/", async (req, res) => {
    res.json({
      message: `Welcome to you!`
    })
  })

  router.get("/health", async (req, res) => {
    res.json({
      message: `I'm fine ^_^!`
    })
  })

  return router;
}
