
export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '592599201765457',
    clientSecret: process.env.FB_CLIENT_SECRET ?? 'e0004282f4a0fcfd9f04044125c8e23f'
  },
  port: process.env.PORT ?? 8080,
  jwtSecret: process.env.JWT_SECRET ?? '3oabnamedida@@---2021'
}
