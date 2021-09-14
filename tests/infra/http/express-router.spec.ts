import { Request, Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { Controller } from '@/application/controllers'
import { mock, MockProxy } from 'jest-mock-extended'
class ExpressRouter {
  constructor (private readonly controller: Controller) {}
  async adapt (request: Request, response: Response): Promise<void> {
    await this.controller.handle({ ...request.body })
  }
}

describe('ExpressRouter', () => {
  let req: Request
  let res: Response
  let controller: MockProxy<Controller>
  let sut: ExpressRouter

  beforeEach(() => {
    req = getMockReq({ body: { any: 'any' } })
    res = getMockRes().res
    controller = mock()
    sut = new ExpressRouter(controller)
  })

  it('should call handle with correct request', async () => {
    await sut.adapt(req, res)

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' })
  })

  it('should call handle with empty request', async () => {
    const req = getMockReq({ })
    await sut.adapt(req, res)

    expect(controller.handle).toHaveBeenCalledWith({})
  })
})
