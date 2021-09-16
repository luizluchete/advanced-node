import { TokenValidator } from '@/domain/contracts/crypto'
import { Authorize, setupAuthorize } from '@/domain/use-cases'
import { mock, MockProxy } from 'jest-mock-extended'

describe('Authorize', () => {
  let crypto: MockProxy<TokenValidator>
  let sut: Authorize
  let token: string

  beforeAll(() => {
    token = 'any_token'
    crypto = mock()
    crypto.validateToken.mockResolvedValue('any_value')
  })

  beforeEach(() => {
    sut = setupAuthorize(crypto)
  })
  it('Should call TokenValidator with correct params', async () => {
    const userId = await sut({ token })

    expect(userId).toBe('any_value')
    expect(crypto.validateToken).toHaveBeenCalledTimes(1)
  })
})
