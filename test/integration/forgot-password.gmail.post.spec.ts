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
})
