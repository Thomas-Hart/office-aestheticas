import { describe, it, expect, vi } from 'vitest'

;(globalThis as any).defineEventHandler = (fn: any) => fn
;(globalThis as any).createError = (err: any) => err
;(globalThis as any).readBody = vi.fn()
;(globalThis as any).useRuntimeConfig = () => ({
  public: { USPS_CLIENT_ID: 'id' },
  private: { USPS_CLIENT_SECRET: 'secret' }
})
;(globalThis as any).$fetch = vi.fn()

let handler: any

beforeAll(async () => {
  const mod = await import('@/server/api/shipping/token.post.js')
  handler = mod.default
})

describe('POST /api/shipping/token', () => {
  it('returns token from USPS', async () => {
    ;(globalThis as any).readBody.mockResolvedValue({})
    ;(globalThis as any).$fetch.mockResolvedValue({ token: 't' })
    const result = await handler({} as any)
    expect((globalThis as any).$fetch).toHaveBeenCalled()
    expect(result).toEqual({ token: 't' })
  })

  it('throws server error on failure', async () => {
    ;(globalThis as any).readBody.mockResolvedValue({})
    ;(globalThis as any).$fetch.mockRejectedValue('fail')
    const err = await handler({} as any)
    expect(err).toMatchObject({ statusCode: 500 })
  })
})
