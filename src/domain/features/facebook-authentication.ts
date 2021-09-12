import { AcessToken } from '@/domain/models'
import { AuthenticationError } from '@/domain/errors'
export interface FacebookAuthentication {
  execute: (token: FacebookAuthentication.Params) => Promise<FacebookAuthentication.Result>
}

export namespace FacebookAuthentication {
  export type Params = {
    token: string
  }

  export type Result = AcessToken | AuthenticationError

}
