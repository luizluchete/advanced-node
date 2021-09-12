import { AcessToken } from '@/domain/models'
import { AuthenticationError } from '@/domain/errors'
export interface FacebookAuthentication {
  execute: (token: FacebookAuthentication.Params) => Promise<FacebookAuthentication.Result>
}

namespace FacebookAuthentication {
  export type Params = {
    token: string
  }

  export type Result = AcessToken | AuthenticationError

}
