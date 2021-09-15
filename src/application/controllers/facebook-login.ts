import { httpResponse, unauthorized, ok } from '@/application/helpers'
import { FacebookAuthentication } from '@/domain/features'
import { AcessToken } from '@/domain/models'
import { Controller } from '@/application/controllers'
import { ValidationBuilder, Validator } from '../validation'

type HttpRequest = {
  token: string
}
type TokenDTO = Error | {
  acessToken: string
}

export class FacebookLoginController extends Controller {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {
    super()
  }

  async execute ({ token }: HttpRequest): Promise<httpResponse<TokenDTO>> {
    const acessToken = await this.facebookAuthentication.execute({ token })

    return acessToken instanceof AcessToken
      ? ok({ acessToken: acessToken.value })
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
