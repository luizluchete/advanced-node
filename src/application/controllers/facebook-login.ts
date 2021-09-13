import { httpResponse } from '@/application/helpers'
import { FacebookAuthentication } from '@/domain/features'
import { AcessToken } from '@/domain/models'
import { ServerError } from '@/application/errors'

export class FacebookLoginController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}
  async handle (httpRequest: any): Promise<httpResponse> {
    try {
      const { token } = httpRequest
      if (token === '' || token === null || token === undefined) {
        return {
          statusCode: 400,
          data: new Error('the field token is required')
        }
      }

      const result = await this.facebookAuthentication.execute({ token: httpRequest.token })
      if (result instanceof AcessToken) {
        return {
          statusCode: 200,
          data: {
            acessToken: result.value
          }
        }
      } else {
        return {
          statusCode: 401,
          data: result
        }
      }
    } catch (error) {
      return {
        statusCode: 500,
        data: new ServerError(error as Error)
      }
    }
  }
}
