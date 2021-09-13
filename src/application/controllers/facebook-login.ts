import { badRequest, httpResponse, serverError, unauthorized, ok } from '@/application/helpers'
import { FacebookAuthentication } from '@/domain/features'
import { AcessToken } from '@/domain/models'
import { RequiredFieldError } from '@/application/errors'

export class FacebookLoginController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}
  async handle (httpRequest: any): Promise<httpResponse> {
    try {
      const { token } = httpRequest
      if (token === '' || token === null || token === undefined) {
        return badRequest(new RequiredFieldError('token'))
      }

      const acessToken = await this.facebookAuthentication.execute({ token: httpRequest.token })
      if (acessToken instanceof AcessToken) {
        return ok({
          acessToken: acessToken.value
        })
      } else {
        return unauthorized()
      }
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
