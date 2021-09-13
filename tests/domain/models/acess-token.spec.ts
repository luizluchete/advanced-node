import { AcessToken } from '@/domain/models'

describe('AcessToken', () => {
  it('Should create with a value', () => {
    const sut = new AcessToken('any_value')

    expect(sut).toEqual({ value: 'any_value' })
  })
})
