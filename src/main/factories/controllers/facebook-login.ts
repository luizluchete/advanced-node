import { FacebookLoginController } from '@/application/controllers'
import { makeFacebookAuthenticateService } from '@/main/factories/services'
export const makeFacebookLoginController = (): FacebookLoginController => {
  return new FacebookLoginController(
    makeFacebookAuthenticateService()
  )
}
