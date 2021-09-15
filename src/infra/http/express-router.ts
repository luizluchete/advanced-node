import { Controller } from '@/application/controllers'
import { RequestHandler } from 'express'

type Adapter = (controller: Controller) => RequestHandler

export const adaptExpressRoute: Adapter = (controller) => async (req, res) => {
  const httpResponse = await controller.handle({ ...req.body })
  const json = httpResponse.statusCode === 200 ? httpResponse.data : { error: httpResponse.data.message }
  res.status(httpResponse.statusCode).json(json)
}
