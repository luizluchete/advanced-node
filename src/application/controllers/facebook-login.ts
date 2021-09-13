import { badRequest, httpResponse, serverError, unauthorized, ok } from '@/application/helpers'
import { FacebookAuthentication } from '@/domain/features'
import { AcessToken } from '@/domain/models'
import { RequiredFieldError } from '@/application/errors'

type HttpRequest = {
  token: string
}
type TokenDTO = Error | {
  acessToken: string
}

export class FacebookLoginController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}
  async handle (httpRequest: HttpRequest): Promise<httpResponse<TokenDTO>> {
    try {
      const error = this.validate(httpRequest)
      if (error !== undefined) {
        return badRequest(error)
      }

      const acessToken = await this.facebookAuthentication.execute({ token: httpRequest.token })
      if (acessToken instanceof AcessToken) {
        return ok<TokenDTO>({
          acessToken: acessToken.value
        })
      } else {
        return unauthorized()
      }
    } catch (error) {
      return serverError(error as Error)
    }
  }

  private validate (httpRequest: HttpRequest): Error | undefined {
    if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
      return new RequiredFieldError('token')
    }
  }
}
