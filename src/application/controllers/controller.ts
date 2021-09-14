import { badRequest, httpResponse, serverError } from '@/application/helpers'
import { ValidationComposite, Validator } from '../validation'

export abstract class Controller {
  abstract execute (httpRequest: any): Promise<httpResponse>
  buildValidators (httpRequest: any): Validator[] {
    return []
  }

  async handle (httpRequest: any): Promise<httpResponse> {
    const error = this.validate(httpRequest)
    if (error !== undefined) {
      return badRequest(error)
    }

    try {
      return await this.execute(httpRequest)
    } catch (error) {
      return serverError(error as Error)
    }
  }

  private validate (httpRequest: any): Error | undefined {
    const validators = this.buildValidators(httpRequest)
    const validator = new ValidationComposite(validators)
    return validator.validate()
  }
}
