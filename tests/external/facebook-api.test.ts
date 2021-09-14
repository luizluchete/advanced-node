import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClient } from '@/infra/http'
import { env } from '@/main/config/env'

describe('Facebook Api Integration Tests', () => {
  it('Should return a Facebook User if token is valid', async () => {
    const axiosClient = new AxiosHttpClient()
    const sut = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret)

    const fbUser = await sut.loadUser({ token: 'EAAIa90DqWFEBAKaodcUZArwr5Yp4fgwEzYMMI4zrUcSeIuUYb5447HOcLpSsXc9pZC53eCBTBKCjwWpgqKZB83ZAZCuh0RrV7OfvPKDdiHgnsSbGuuOnI8ESkwLEiJt5nhYcBS1ZCizF0g5FC9sySycucLCs5fcCZCq2ZC2f6XrfveVuh934YAvjg85eb0kRflEZBZA4M2fISrUwsZBcfxGCmkr' })
    expect(fbUser).toEqual({
      facebookId: '102887592148677',
      email: 'luiz_aplivdr_teste@tfbnw.net',
      name: 'Luiz Teste'
    })
  })

  it('Should return undefied if token is invalid', async () => {
    const axiosClient = new AxiosHttpClient()
    const sut = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret)

    const fbUser = await sut.loadUser({ token: 'invalid' })

    expect(fbUser).toBeUndefined()
  })
})
