import { FacebookApi } from '@/infra/apis'

import { env } from '@/main/config/env'
import { makeAxiosHttpClient } from '../http'

export const makeFacebookApi = (): FacebookApi => {
  const axiosClient = makeAxiosHttpClient()
  return new FacebookApi(
    axiosClient,
    env.facebookApi.clientId,
    env.facebookApi.clientSecret)
}
