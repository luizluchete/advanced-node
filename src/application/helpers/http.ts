import { ServerError, UnauthorizedError } from '@/application/errors'

export type httpResponse = {
  statusCode: number
  data: any
}

export const ok = (data: any): httpResponse => ({
  statusCode: 200,
  data
})

export const badRequest = (error: Error): httpResponse => ({
  statusCode: 400,
  data: error
})

export const unauthorized = (): httpResponse => ({
  statusCode: 401,
  data: new UnauthorizedError()
})

export const serverError = (error: Error): httpResponse => ({
  statusCode: 500,
  data: new ServerError(error)
})
