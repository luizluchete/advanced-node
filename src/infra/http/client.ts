export interface HttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<HttpGetClient.Result>
}

namespace HttpGetClient {
  export type Params = {
    url: string
    params: Object
  }
  export type Result = any
}
