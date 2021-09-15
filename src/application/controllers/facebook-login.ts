import { httpResponse, unauthorized, ok } from '@/application/helpers'
import { Controller } from '@/application/controllers'
import { FacebookAuthentication } from '@/domain/use-cases'
import { ValidationBuilder, Validator } from '@/application/validation'

type HttpRequest = { token: string}
type TokenDTO = Error | { accessToken: string}

export class FacebookLoginController extends Controller {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {
    super()
  }

  async execute ({ token }: HttpRequest): Promise<httpResponse<TokenDTO>> {
    try {
      const acessToken = await this.facebookAuthentication({ token })
      return ok(acessToken)
    } catch (error) {
      return unauthorized()
    }
  }

  override buildValidators ({ token }: HttpRequest): Validator[] {
    const validators = ValidationBuilder
      .of({ value: token, fieldName: 'token' })
      .required()
      .build()
    return validators
  }
}
