import { describe, it, expect, vi, beforeEach } from 'vitest'

let SESClientMock: any
let SendTemplatedEmailCommandMock: any
let sendMock: any

vi.mock('@aws-sdk/client-ses', () => {
  sendMock = vi.fn()
  SESClientMock = vi.fn().mockImplementation(function (this: any, config: any) {
    this.config = config
  })
  SESClientMock.prototype.send = sendMock
  SendTemplatedEmailCommandMock = vi.fn(function (input: any) { this.input = input })
  return {
    SESClient: SESClientMock,
    SendTemplatedEmailCommand: SendTemplatedEmailCommandMock
  }
})

vi.mock('h3', async () => {
  const actual = await vi.importActual<typeof import('h3')>('h3')
  return {
    ...actual,
    defineEventHandler: (fn: any) => fn,
    createError: (err: any) => err,
    readBody: (...args: any[]) => (globalThis as any).readBody(...args)
  }
})
(globalThis as any).readBody = vi.fn()
;(globalThis as any).useRuntimeConfig = () => ({
  public: {
    AWS_REGION: 'us',
    SES_SOURCE_EMAIL: 'from@example.com',
    SES_TEMPLATE_NAME: 'template'
  },
  private: {
    AWS_ACCESS_KEY_ID: 'key',
    AWS_SECRET_ACCESS_KEY: 'secret'
  }
})

let handler: any

beforeEach(async () => {
  vi.resetModules()
  const mod = await import('@/server/api/forgot-password/ses.post.js')
  handler = mod.default
  vi.clearAllMocks()
})

describe('POST /api/forgot-password/ses', () => {
  it('sends reset email via SES', async () => {
    ;(globalThis as any).readBody.mockResolvedValue({
      email: 'user@example.com',
      resetLink: 'link'
    })
    const result = await handler({} as any)
    expect(SESClientMock).toHaveBeenCalledWith({
      region: 'us',
      credentials: { accessKeyId: 'key', secretAccessKey: 'secret' }
    })
    expect(SendTemplatedEmailCommandMock).toHaveBeenCalledWith({
      Source: 'from@example.com',
      Destination: { ToAddresses: ['user@example.com'] },
      Template: 'template',
      TemplateData: JSON.stringify({ resetLink: 'link' })
    })
    expect(sendMock).toHaveBeenCalled()
    expect(result).toEqual({ status: 'ok' })
  })

  it('throws 400 on invalid email', async () => {
    ;(globalThis as any).readBody.mockResolvedValue({ email: 'bad', resetLink: '' })
    await expect(handler({} as any)).rejects.toMatchObject({ statusCode: 400 })
  })

  it('rate limits repeated requests', async () => {
    ;(globalThis as any).readBody.mockResolvedValue({
      email: 'user@example.com',
      resetLink: 'link'
    })
    await handler({} as any)
    await expect(handler({} as any)).rejects.toMatchObject({ statusCode: 429 })
    expect(sendMock).toHaveBeenCalledTimes(1)
  })

  it('allows another request after window passes', async () => {
    vi.useFakeTimers()
    ;(globalThis as any).readBody.mockResolvedValue({
      email: 'user@example.com',
      resetLink: 'link'
    })
    await handler({} as any)
    vi.advanceTimersByTime(5 * 60 * 1000 + 1)
    await expect(handler({} as any)).resolves.toEqual({ status: 'ok' })
    expect(sendMock).toHaveBeenCalledTimes(2)
    vi.useRealTimers()
  })
})
