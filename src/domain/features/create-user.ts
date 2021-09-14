import { AccountModel } from '../models/account'

export interface CreateUser {
  execute: (params: CreateUser.Params) => Promise<AccountModel>
}

export namespace CreateUser{
  export type Params = {
    name: string
    email: string
    password: string
  }
}
