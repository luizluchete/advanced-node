import { Controller } from '@/application/controllers'
import { RequestHandler } from 'express'
// export class ExpressRouter {
//   constructor (private readonly controller: Controller) {}
//   async adapt (request: Request, response: Response): Promise<void> {
//     const httpResponse = await this.controller.handle({ ...request.body })
//     if (httpResponse.statusCode === 200) {
//       response.status(200).json(httpResponse.data)
//     } else {
//       response.status(httpResponse.statusCode).json({ error: httpResponse.data.message })
//     }
//   }
// }

export const adaptExpressRoute = (controller: Controller): RequestHandler => {
  return async (req, res) => {
    const httpResponse = await controller.handle({ ...req.body })
    if (httpResponse.statusCode === 200) {
      res.status(200).json(httpResponse.data)
    } else {
      res.status(httpResponse.statusCode).json({ error: httpResponse.data.message })
    }
  }
}
