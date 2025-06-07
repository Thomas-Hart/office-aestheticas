import { describe, it, expect, vi } from 'vitest'

;(globalThis as any).defineEventHandler = (fn: any) => fn
;(globalThis as any).createError = (err: any) => err
;(globalThis as any).readBody = vi.fn()
;(globalThis as any).useRuntimeConfig = () => ({
  public: { META_PIXEL_ID: 'pid' },
  private: { META_ACCESS_TOKEN: 'tok' }
})
;(globalThis as any).fetch = vi.fn().mockResolvedValue({})

let handler: any

beforeAll(async () => {
  const mod = await import('@/server/api/facebook-events/index.post.js')
  handler = mod.default
})

describe('POST /api/facebook-events', () => {
  it('sends event to facebook', async () => {
    ;(globalThis as any).readBody.mockResolvedValue({ eventName: 'View', data: {} })
    const result = await handler({} as any)
    expect((globalThis as any).fetch).toHaveBeenCalled()
    expect(result).toEqual({ success: true })
  })
})
