import { AcessToken } from '@/domain/models'

describe('AcessToken', () => {
  it('Should expire in 1800000 ms', () => {
    expect(AcessToken.expirationInMs).toBe(1800000)
  })
})
