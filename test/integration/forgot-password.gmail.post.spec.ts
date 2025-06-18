import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'

let createTransportMock: any
let sendMailMock: any
let OAuth2Mock: any
let oAuthInstance: any

vi.mock('nodemailer', () => {
  sendMailMock = vi.fn()
  createTransportMock = vi.fn(() => ({ sendMail: sendMailMock }))
  return { default: { createTransport: createTransportMock } }
})

vi.mock('googleapis', () => {
  OAuth2Mock = vi.fn().mockImplementation(function () {
    oAuthInstance = this
    this.setCredentials = vi.fn()
    this.getAccessToken = vi.fn().mockResolvedValue('token')
  })
  return { google: { auth: { OAuth2: OAuth2Mock } } }
})

vi.mock('h3', async () => {
  const actual = await vi.importActual<typeof import('h3')>('h3')
  return {
    ...actual,
    defineEventHandler: (fn: any) => fn,
    readBody: (...args: any[]) => (globalThis as any).readBody(...args),
    createError: (err: any) => err
  }
})

vi.mock('mjml', () => ({
  default: vi.fn(() => ({ html: '<p>html</p>', errors: [] }))
}))
;(globalThis as any).readBody = vi.fn()
;(globalThis as any).useRuntimeConfig = () => ({
  public: {
    GMAIL_CLIENT_ID: 'id',
    GMAIL_USER: 'user'
  },
  private: {
    GMAIL_CLIENT_SECRET: 'secret',
    GMAIL_REDIRECT_URI: 'uri',
    GMAIL_REFRESH_TOKEN: 'refresh'
  }
})

let handler: any

beforeAll(async () => {
  const mod = await import('@/server/api/forgot-password/gmail.post.js')
  handler = mod.default
})

beforeEach(() => {
  vi.clearAllMocks()
})

describe('POST /api/forgot-password/gmail', () => {
  it('reads the request body from the event', async () => {
    const evt = {} as any
    ;(globalThis as any).readBody.mockResolvedValue({
      email: 'user@example.com',
      link: 'x',
      resetToken: 'tok'
    })
    await handler(evt)
    expect((globalThis as any).readBody).toHaveBeenCalledWith(evt)
  })

  it('sends reset email via Gmail', async () => {
    ;(globalThis as any).readBody.mockResolvedValue({
      email: 'a@b.com',
      link: 'https://app',
      resetToken: 'abc'
    })
    const result = await handler({} as any)
    expect(createTransportMock).toHaveBeenCalledWith({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'user',
        clientId: 'id',
        clientSecret: 'secret',
        refreshToken: 'refresh',
        accessToken: 'token'
      }
    })
    expect(sendMailMock).toHaveBeenCalled()
    expect(result).toEqual({ status: 'ok' })
  })

  it('initializes OAuth2 client correctly', async () => {
    ;(globalThis as any).readBody.mockResolvedValue({
      email: 'a@b.com',
      link: 'https://app',
      resetToken: 'abc'
    })
    await handler({} as any)
    expect(OAuth2Mock).toHaveBeenCalledWith('id', 'secret', 'uri')
    expect(oAuthInstance.setCredentials).toHaveBeenCalledWith({ refresh_token: 'refresh' })
    expect(oAuthInstance.getAccessToken).toHaveBeenCalled()
  })

  it('warns on MJML errors', async () => {
    const mjml = await import('mjml')
    ;(mjml.default as any).mockReturnValueOnce({ html: '<p>html</p>', errors: ['bad'] })
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    ;(globalThis as any).readBody.mockResolvedValue({ email: 'a@b.com', link: 'x', resetToken: 'y' })
    await handler({} as any)
    expect(warnSpy).toHaveBeenCalledWith('MJML errors:', ['bad'])
    warnSpy.mockRestore()
  })

  it('sends the correct email parameters', async () => {
    ;(globalThis as any).readBody.mockResolvedValue({ email: 'to@user.com', link: 'https://site', resetToken: 'tok' })
    await handler({} as any)
    expect(sendMailMock).toHaveBeenCalledWith({
      from: '"Your Store" <user>',
      to: 'to@user.com',
      subject: 'Reset your password',
      html: '<p>html</p>'
    })
  })

  it('passes link and token to the MJML template', async () => {
    const mjml = await import('mjml')
    ;(globalThis as any).readBody.mockResolvedValue({
      email: 'to@user.com',
      link: 'https://site',
      resetToken: 'tok'
    })
    await handler({} as any)
    expect(mjml.default).toHaveBeenCalledWith(
      expect.stringContaining('href="https://site/reset-password?token=tok"')
    )
  })

  it('uses fallback redirect uri when none provided', async () => {
    const orig = (globalThis as any).useRuntimeConfig
    ;(globalThis as any).useRuntimeConfig = () => ({
      public: { GMAIL_CLIENT_ID: 'id', GMAIL_USER: 'user' },
      private: { GMAIL_CLIENT_SECRET: 'secret', GMAIL_REFRESH_TOKEN: 'refresh' }
    })
    ;(globalThis as any).readBody.mockResolvedValue({ email: 'a@b.com', link: 'https://app', resetToken: 'abc' })
    await handler({} as any)
    expect(OAuth2Mock).toHaveBeenCalledWith('id', 'secret', 'https://developers.google.com/oauthplayground')
    ;(globalThis as any).useRuntimeConfig = orig
  })

  it('handles object access token responses', async () => {
    OAuth2Mock.mockImplementationOnce(function (this: any) {
      oAuthInstance = this
      this.setCredentials = vi.fn()
      this.getAccessToken = vi.fn().mockResolvedValue({ token: 'obj' })
    })
    ;(globalThis as any).readBody.mockResolvedValue({ email: 'a@b.com', link: 'https://app', resetToken: 'abc' })
    await handler({} as any)
    expect(createTransportMock).toHaveBeenCalledWith(expect.objectContaining({ auth: expect.objectContaining({ accessToken: 'obj' }) }))
  })

  it('propagates errors from sendMail', async () => {
    ;(globalThis as any).readBody.mockResolvedValue({
      email: 'err@user.com',
      link: 'https://app',
      resetToken: 'tok'
    })
    sendMailMock.mockRejectedValue(new Error('fail'))
    await expect(handler({} as any)).rejects.toThrow('fail')
  })

  it('propagates errors from OAuth token retrieval', async () => {
    OAuth2Mock.mockImplementationOnce(function (this: any) {
      oAuthInstance = this
      this.setCredentials = vi.fn()
      this.getAccessToken = vi.fn().mockRejectedValue(new Error('token fail'))
    })
    ;(globalThis as any).readBody.mockResolvedValue({ email: 'a@b.com', link: 'https://app', resetToken: 'tok' })
    await expect(handler({} as any)).rejects.toThrow('token fail')
  })
})
