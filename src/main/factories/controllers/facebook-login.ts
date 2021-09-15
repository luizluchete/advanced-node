import { FacebookLoginController } from '@/application/controllers'
import { makeFacebookAuthenticate } from '@/main/factories/use-cases'
export const makeFacebookLoginController = (): FacebookLoginController => {
  return new FacebookLoginController(makeFacebookAuthenticate())
}
