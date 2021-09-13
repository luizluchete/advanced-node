import { badRequest, httpResponse, serverError, unauthorized, ok } from '@/application/helpers'
import { FacebookAuthentication } from '@/domain/features'
import { AcessToken } from '@/domain/models'
import { RequiredFieldError } from '@/application/errors'

type HttpRequest = {
  token: string | null | undefined
}
type TokenDTO = Error | {
  acessToken: string
}

export class FacebookLoginController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}
  async handle (httpRequest: HttpRequest): Promise<httpResponse<TokenDTO>> {
    try {
      const { token } = httpRequest
      if (token === '' || token === null || token === undefined) {
        return badRequest(new RequiredFieldError('token'))
      }

      const acessToken = await this.facebookAuthentication.execute({ token: token })
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
}
