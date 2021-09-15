import { httpResponse, unauthorized, ok } from '@/application/helpers'
import { AcessToken } from '@/domain/models'
import { Controller } from '@/application/controllers'
import { ValidationBuilder, Validator } from '../validation'
import { FacebookAuthentication } from '@/domain/use-cases'

type HttpRequest = { token: string}
type TokenDTO = Error | { accessToken: string}

export class FacebookLoginController extends Controller {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {
    super()
  }

  async execute ({ token }: HttpRequest): Promise<httpResponse<TokenDTO>> {
    const acessToken = await this.facebookAuthentication({ token })

    return acessToken instanceof AcessToken
      ? ok({ accessToken: acessToken.value })
      : unauthorized()
  }

  override buildValidators ({ token }: HttpRequest): Validator[] {
    const validators = ValidationBuilder
      .of({ value: token, fieldName: 'token' })
      .required()
      .build()
    return validators
  }
}
